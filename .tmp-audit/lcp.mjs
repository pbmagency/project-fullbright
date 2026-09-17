import { spawn } from 'node:child_process';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9345;
const URL = process.argv[2];

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
        `--user-data-dir=${process.cwd()}/.tmp-audit/profile`,
        '--no-first-run',
        '--disable-gpu',
        'about:blank',
    ], { stdio: 'ignore' });

    for (let i = 0; i < 40 && !(await alive()); i += 1) await sleep(300);
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

const t = await send('Target.createTarget', { url: 'about:blank' });
const a = await send('Target.attachToTarget', { targetId: t.result.targetId, flatten: true });
const sid = a.result.sessionId;

await send('Page.enable', {}, sid);
await send('Runtime.enable', {}, sid);
await send('Emulation.setDeviceMetricsOverride', { width: 412, height: 823, deviceScaleFactor: 1.75, mobile: true }, sid);
// Throttling ringan seperti Lighthouse mobile (simulate 4G)
await send('Network.enable', {}, sid);
await send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 }, sid);
await send('Emulation.setCPUThrottlingRate', { rate: 4 }, sid);

const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sid);
    return res.result?.result?.value;
};

await send('Page.navigate', { url: URL }, sid);
await sleep(500);
await evaluate(`
  window.__lcp = [];
  window.__fcp = null;
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      window.__lcp.push({
        time: Math.round(e.startTime),
        size: e.size,
        tag: e.element ? e.element.tagName : null,
        cls: e.element ? String(e.element.className).slice(0, 60) : null,
        text: e.element && e.element.textContent ? e.element.textContent.trim().slice(0, 40) : null,
      });
    }
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) if (e.name === 'first-contentful-paint') window.__fcp = Math.round(e.startTime);
  }).observe({ type: 'paint', buffered: true });
`);

await sleep(14000);

console.log('FCP:', await evaluate('window.__fcp'));
console.log('LCP candidates:');
const cands = await evaluate('JSON.stringify(window.__lcp)');
JSON.parse(cands ?? '[]').forEach((c) => console.log(' ', String(c.time).padStart(5), 'ms | size', String(c.size).padStart(7), '|', c.tag, '|', c.text));

ws.close();
process.exit(0);
