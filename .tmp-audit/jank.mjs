// Measures runtime jank (long tasks, frame gaps, slow interaction events) of a page.
// Usage: node .tmp-audit/jank.mjs [url]
import { spawn } from 'node:child_process';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9347;
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
    spawn(CHROME, [
        '--headless=new',
        `--remote-debugging-port=${PORT}`,
        `--user-data-dir=${process.cwd()}/.tmp-audit/profile-jank`,
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
ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
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

const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sid);
    if (res.result?.exceptionDetails) console.log('EVAL ERROR', res.result.exceptionDetails.text);
    return res.result?.result?.value;
};

await send('Page.navigate', { url: URL }, sid);
await sleep(400);

await evaluate(`
    window.__lt = [];
    window.__ev = [];
    window.__frames = [];
    window.__raf = false;
    new PerformanceObserver((list) => {
        for (const e of list.getEntries()) window.__lt.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) });
    }).observe({ type: 'longtask', buffered: true });
    new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
            window.__ev.push({ type: e.name, dur: Math.round(e.duration), delay: Math.round((e.processingStart || e.startTime) - e.startTime) });
        }
    }).observe({ type: 'event', buffered: true, durationThreshold: 40 });
    window.__startFrames = () => {
        window.__raf = true;
        let last = performance.now();
        const step = (now) => {
            if (!window.__raf) return;
            window.__frames.push(Math.round(now - last));
            last = now;
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    window.__reset = () => { window.__lt = []; window.__ev = []; window.__frames = []; };
    true;
`);

await sleep(9000);

const report = async (label) => {
    const lt = JSON.parse(await evaluate('JSON.stringify(window.__lt)') || '[]');
    const ev = JSON.parse(await evaluate('JSON.stringify(window.__ev)') || '[]');
    const frames = JSON.parse(await evaluate('JSON.stringify(window.__frames)') || '[]');
    const tbt = lt.reduce((sum, e) => sum + Math.max(0, e.dur - 50), 0);
    const sorted = [...frames].sort((a, b) => b - a);
    const longFrames = frames.filter((f) => f > 50).length;
    console.log(`\n=== ${label}`);
    console.log(`  longTasks: ${lt.length}  TBT: ${tbt}ms  max: ${lt.length ? Math.max(...lt.map((e) => e.dur)) : 0}ms  total: ${lt.reduce((s, e) => s + e.dur, 0)}ms`);
    console.log(`  slowEvents(>40ms): ${ev.length}  max: ${ev.length ? Math.max(...ev.map((e) => e.dur)) : 0}ms  ${JSON.stringify(ev.slice(0, 6))}`);
    if (frames.length) {
        console.log(`  frames: ${frames.length}  >50ms: ${longFrames}  worst: ${sorted.slice(0, 5).join('/')}ms  avg: ${Math.round(frames.reduce((a, b) => a + b, 0) / frames.length)}ms`);
    }
};

await report('PHASE 1: initial load + idle');

// --- scroll phase: step through the page like a user scrolling
await evaluate('window.__reset(); window.__startFrames(); true');
const scrollHeight = await evaluate('document.documentElement.scrollHeight');
for (let y = 0; y < Math.min(scrollHeight, 14000); y += 700) {
    await evaluate(`window.scrollTo(0, ${y}); true`);
    await sleep(260);
}
await report('PHASE 2: scroll through page');

// --- interaction phase: FAQ toggles, category filter, survey, gallery
await evaluate('window.__reset(); true');
await evaluate(`
    document.getElementById('faq').scrollIntoView({ block: 'center' });
    true;
`);
await sleep(700);
await evaluate('window.__reset(); true');
for (let i = 0; i < 5; i += 1) {
    await evaluate(`
        const q = document.querySelectorAll('#faq div[style*="border-bottom"] > button');
        if (q[${i}]) q[${i}].click();
        true;
    `);
    await sleep(500);
}
await evaluate(`
    const cats = document.querySelectorAll('#faq div[class*="justify-content:center"] > button');
    if (cats[2]) cats[2].click();
    true;
`);
await sleep(900);
await evaluate(`
    const opt = document.querySelector('#survey button[style*="min-height:48px"]');
    if (opt) opt.click();
    true;
`);
await sleep(900);
await evaluate(`
    const img = document.querySelector('#testimonials img[class*="cursor:pointer"]');
    if (img) img.click();
    true;
`);
await sleep(1200);
await evaluate(`
    const close = document.querySelector('#review-lightbox');
    if (close) close.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    true;
`);
await sleep(1200);
await report('PHASE 3: interactions (FAQ, filter, survey, gallery)');

const nodes = await evaluate('document.getElementsByTagName("*").length');
const domSize = await evaluate('JSON.stringify({nodes: document.getElementsByTagName("*").length, depth: (() => { let max = 0; const walk = (el, d) => { if (d > max) max = d; for (const c of el.children) walk(c, d + 1); }; walk(document.body, 0); return max; })()})');
console.log('\n=== DOM', domSize, 'nodes:', nodes);

ws.close();
process.exit(0);
