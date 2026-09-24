// Measures click -> next paint latency for real interactions.
// Usage: node .tmp-audit/interaction.mjs [url]
import { spawn } from 'node:child_process';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9351;
const URL = process.argv[2] || 'http://127.0.0.1:8000/c10-lp';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function alive() {
    try {
        return (await fetch(`http://127.0.0.1:${PORT}/json/version`, { signal: AbortSignal.timeout(1500) })).ok;
    } catch {
        return false;
    }
}

if (!(await alive())) {
    spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${process.cwd()}/.tmp-audit/profile-int`, '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
    for (let i = 0; i < 60 && !(await alive()); i += 1) await sleep(300);
}

const version = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const pending = new Map();
ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
};
const send = (method, params = {}, sessionId) => {
    const msgId = ++id;
    return new Promise((resolve) => { pending.set(msgId, resolve); ws.send(JSON.stringify({ id: msgId, method, params, sessionId })); });
};

const target = await send('Target.createTarget', { url: 'about:blank' });
const attached = await send('Target.attachToTarget', { targetId: target.result.targetId, flatten: true });
const sid = attached.result.sessionId;

await send('Page.enable', {}, sid);
await send('Runtime.enable', {}, sid);
await send('Emulation.setDeviceMetricsOverride', { width: 412, height: 823, deviceScaleFactor: 1.5, mobile: true }, sid);
await send('Emulation.setCPUThrottlingRate', { rate: 4 }, sid);

const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sid);
    if (res.result?.exceptionDetails) console.log('EVAL ERROR', JSON.stringify(res.result.exceptionDetails.exception?.description || res.result.exceptionDetails.text));
    return res.result?.result?.value;
};

await send('Page.navigate', { url: URL }, sid);
await sleep(1000);

await evaluate(`
    (() => {
        window.__lt = [];
        window.__ev = [];
        new PerformanceObserver((list) => {
            for (const e of list.getEntries()) window.__lt.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) });
        }).observe({ type: 'longtask', buffered: true });
        new PerformanceObserver((list) => {
            for (const e of list.getEntries()) window.__ev.push({ type: e.name, dur: Math.round(e.duration) });
        }).observe({ type: 'event', buffered: true, durationThreshold: 30 });
        window.__clickToPaint = (selector, index) => new Promise((resolve) => {
            const target = document.querySelectorAll(selector)[index || 0];
            if (!target) return resolve({ ok: false, selector });
            const before = window.__lt.length;
            const t0 = performance.now();
            target.click();
            requestAnimationFrame(() => requestAnimationFrame(() => {
                const tasks = window.__lt.slice(before);
                resolve({
                    ok: true,
                    ms: Math.round(performance.now() - t0),
                    longTasks: tasks.map((t) => t.dur),
                });
            }));
        });
        return true;
    })();
`);

await sleep(9000);

const run = async (label, selector, index = 0) => {
    const res = await evaluate(`window.__clickToPaint(${JSON.stringify(selector)}, ${index})`);
    console.log(`${label.padEnd(46)} click->paint ${String(res?.ms).padStart(4)}ms  longTasks [${(res?.longTasks || []).join(', ')}]`);
    await sleep(700);
    return res;
};

await evaluate(`document.getElementById('faq').scrollIntoView({ block: 'center' }); true`);
await sleep(1200);

console.log('--- FAQ (state lives in the page component)');
await run('open FAQ #1 (below other sections)', '#faq div[style*="border-bottom"] > button', 0);
await run('open FAQ #2', '#faq div[style*="border-bottom"] > button', 1);
await run('open FAQ #3', '#faq div[style*="border-bottom"] > button', 2);
await run('filter FAQ category', '#faq div[class*="justify-content:center"] > button', 2);
await run('reset FAQ filter', '#faq div[class*="justify-content:center"] > button', 0);

console.log('--- others');
await evaluate(`document.getElementById('survey').scrollIntoView({ block: 'center' }); true`);
await sleep(1000);
await run('survey option click', '#survey button[style*="min-height:48px"]', 0);
await evaluate(`document.getElementById('testimonials').scrollIntoView({ block: 'center' }); true`);
await sleep(1500);
await run('open review lightbox', '#testimonials img[class*="cursor:pointer"]', 0);
await run('close lightbox (Escape key)', '#review-lightbox', 0);

const ev = JSON.parse((await evaluate('JSON.stringify(window.__ev)')) || '[]');
console.log('\nSlow events >30ms:', ev.length, 'max', ev.length ? Math.max(...ev.map((e) => e.dur)) : 0, 'ms', JSON.stringify(ev.slice(0, 8)));

ws.close();
process.exit(0);
