// Records a DevTools trace of page load and reports main-thread time by activity.
// Usage: node .tmp-audit/trace.mjs [url] [waitMs]
import { spawn } from 'node:child_process';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9349;
const URL = process.argv[2] || 'http://127.0.0.1:8000/c10-lp';
const WAIT = Number(process.argv[3] || 8000);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function alive() {
    try {
        return (await fetch(`http://127.0.0.1:${PORT}/json/version`, { signal: AbortSignal.timeout(1500) })).ok;
    } catch {
        return false;
    }
}

if (!(await alive())) {
    spawn(CHROME, [
        '--headless=new',
        `--remote-debugging-port=${PORT}`,
        `--user-data-dir=${process.cwd()}/.tmp-audit/profile-trace`,
        '--no-first-run',
        '--no-default-browser-check',
        'about:blank',
    ], { stdio: 'ignore' });

    for (let i = 0; i < 60 && !(await alive()); i += 1) await sleep(300);
}

const version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const pending = new Map();
const collected = [];
ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.method === 'Tracing.dataCollected') collected.push(...m.params.value);
    if (m.method === 'Tracing.bufferUsage') return;
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
};

const send = (method, params = {}, sessionId) => {
    const msgId = ++id;
    return new Promise((resolve) => {
        pending.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params, sessionId }));
    });
};

const target = await send('Target.createTarget', { url: 'about:blank' });
const attached = await send('Target.attachToTarget', { targetId: target.result.targetId, flatten: true });
const sid = attached.result.sessionId;

await send('Page.enable', {}, sid);
await send('Runtime.enable', {}, sid);
await send('Emulation.setDeviceMetricsOverride', { width: 412, height: 823, deviceScaleFactor: 1.5, mobile: true }, sid);
await send('Emulation.setCPUThrottlingRate', { rate: 4 }, sid);

await send('Tracing.start', {
    categories: [
        'devtools.timeline',
        'disabled-by-default-devtools.timeline',
        'disabled-by-default-devtools.timeline.frame',
        'blink.user_timing',
        'loading',
    ].join(','),
    transferMode: 'ReportEvents',
}, sid);

await send('Page.navigate', { url: URL }, sid);
await sleep(WAIT);
await send('Tracing.end', {}, sid);

for (let i = 0; i < 50 && (await fetch(`http://127.0.0.1:${PORT}/json/version`)).ok; i += 1) {
    if (collected.length > 0 && !pending.size) break;
    await sleep(200);
}
await sleep(1500);

// main renderer thread
const mainThread = collected.find((e) => e.name === 'thread_name' && e.args?.name === 'CrRendererMain');
const tid = mainThread?.tid;

// self time = own duration minus children durations (approximate via stack)
const selfTime = new Map();
const stackByThread = new Map();
const sorted = collected.filter((e) => e.ph === 'X' && e.tid === tid && e.dur).sort((a, b) => a.ts - b.ts);
for (const e of sorted) {
    const stack = stackByThread.get(tid) || [];
    while (stack.length && stack[stack.length - 1].ts + stack[stack.length - 1].dur <= e.ts) stack.pop();
    const parent = stack[stack.length - 1];
    const own = e.dur;
    if (parent) parent.__child = (parent.__child || 0) + own;
    stack.push(e);
    stackByThread.set(tid, stack);
}
for (const e of sorted) {
    selfTime.set(e.name, (selfTime.get(e.name) || 0) + Math.max(0, e.dur - (e.__child || 0)));
}

const rows = [...selfTime.entries()].sort((a, b) => b[1] - a[1]).slice(0, 22);
console.log(`Main-thread self time (ms) over ${WAIT}ms, tid ${tid}:`);
for (const [name, ms] of rows) console.log(`  ${String(Math.round(ms)).padStart(6)}  ${name}`);

const allX = collected.filter((e) => e.ph === 'X' && e.tid === tid && e.dur);
const tasks = allX
    .filter((e) => e.name === 'RunTask')
    .sort((a, b) => b.dur - a.dur)
    .slice(0, 3);

for (const task of tasks) {
    const inside = allX
        .filter((e) => e.ts >= task.ts && e.ts < task.ts + task.dur && e !== task)
        .sort((a, b) => a.ts - b.ts);
    // direct children = events with no enclosing event other than the task
    const direct = [];
    const stack = [];
    for (const e of inside) {
        while (stack.length && stack[stack.length - 1].ts + stack[stack.length - 1].dur <= e.ts) stack.pop();
        if (stack.length === 0) direct.push(e);
        stack.push(e);
    }
    const agg = new Map();
    for (const e of direct) agg.set(e.name, (agg.get(e.name) || 0) + e.dur);
    const rows = [...agg.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    console.log(`\nTask ${Math.round(task.dur / 1000)}ms @ ${Math.round(task.ts / 1000)}ms top-level breakdown:`);
    for (const [name, ms] of rows) console.log(`    ${String(Math.round(ms)).padStart(6)}  ${name}`);
}

ws.close();
process.exit(0);
