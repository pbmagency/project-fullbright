// Timeline of long tasks vs DOM growth vs font load during page load.
// Usage: node .tmp-audit/load-timeline.mjs [url]
import { spawn } from 'node:child_process';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9350;
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
    spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${process.cwd()}/.tmp-audit/profile-tl`, '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
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
    if (res.result?.exceptionDetails) console.log('EVAL ERROR', res.result.exceptionDetails.text);
    return res.result?.result?.value;
};

await send('Page.navigate', { url: URL }, sid);
await sleep(300);

await evaluate(`
    (() => {
        const t0 = performance.now();
        window.__tl = { longtasks: [], mutations: [], nodeSamples: [], fonts: null, fcp: null };
        new PerformanceObserver((list) => {
            for (const e of list.getEntries()) window.__tl.longtasks.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) });
        }).observe({ type: 'longtask', buffered: true });
        new PerformanceObserver((list) => {
            for (const e of list.getEntries()) if (e.name === 'first-contentful-paint') window.__tl.fcp = Math.round(e.startTime);
        }).observe({ type: 'paint', buffered: true });
        let added = 0;
        new MutationObserver((records) => {
            let n = 0;
            for (const r of records) n += r.addedNodes.length;
            if (n) {
                added += n;
                window.__tl.mutations.push({ t: Math.round(performance.now()), added: n, total: document.getElementsByTagName('*').length });
            }
        }).observe(document.documentElement, { childList: true, subtree: true });
        document.fonts.ready.then(() => { window.__tl.fonts = Math.round(performance.now()); });
        const sample = () => window.__tl.nodeSamples.push({ t: Math.round(performance.now()), nodes: document.getElementsByTagName('*').length });
        [500, 1000, 1500, 2000, 3000, 4000, 6000].forEach((ms) => setTimeout(sample, ms));
        return true;
    })();
`);

await sleep(11000);
console.log(await evaluate('JSON.stringify(window.__tl, null, 1)'));

ws.close();
process.exit(0);
