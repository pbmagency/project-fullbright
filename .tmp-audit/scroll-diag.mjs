// Scroll-jank diagnosis: runs the same scroll pass under different CSS overrides
// to pinpoint which effects cost the most main-thread time.
// Usage: node .tmp-audit/scroll-diag.mjs [url]
import { spawn } from 'node:child_process';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9348;
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
        `--user-data-dir=${process.cwd()}/.tmp-audit/profile-diag`,
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
    (() => {
        window.__lt = [];
        window.__frames = [];
        window.__raf = false;
        new PerformanceObserver((list) => {
            for (const e of list.getEntries()) window.__lt.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) });
        }).observe({ type: 'longtask', buffered: true });
        window.__startFrames = () => {
            window.__raf = true;
            window.__frames = [];
            let last = performance.now();
            const step = (now) => {
                if (!window.__raf) return;
                window.__frames.push(Math.round(now - last));
                last = now;
                requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        };
        window.__reset = () => { window.__lt = []; window.__frames = []; };
        window.__override = (css) => {
            const el = document.getElementById('__diag') || document.head.appendChild(Object.assign(document.createElement('style'), { id: '__diag' }));
            el.textContent = css;
        };
        return true;
    })();
`);

await sleep(9000);

const scrollHeight = await evaluate('document.documentElement.scrollHeight');

const pass = async (label, css) => {
    await evaluate(`window.__override(${JSON.stringify(css)}); true`);
    await evaluate('window.scrollTo(0, 0); true');
    await sleep(900);
    await evaluate('window.__reset(); window.__startFrames(); true');
    for (let y = 0; y < Math.min(scrollHeight, 14000); y += 700) {
        await evaluate(`window.scrollTo(0, ${y}); true`);
        await sleep(260);
    }
    const lt = JSON.parse((await evaluate('JSON.stringify(window.__lt)')) || '[]');
    const frames = JSON.parse((await evaluate('JSON.stringify(window.__frames)')) || '[]');
    const tbt = lt.reduce((s, e) => s + Math.max(0, e.dur - 50), 0);
    const worst = [...frames].sort((a, b) => b - a).slice(0, 5);
    console.log(
        `${label.padEnd(34)} longTasks ${String(lt.length).padStart(2)} | TBT ${String(tbt).padStart(5)}ms | maxTask ${String(lt.length ? Math.max(...lt.map((e) => e.dur)) : 0).padStart(4)}ms | frames ${frames.length} | >50ms ${String(frames.filter((f) => f > 50).length).padStart(3)} | worst ${worst.join('/')}ms`,
    );
    return tbt;
};

await pass('P0 cold (baseline)', '');

await pass('P1 warm (no override)', '');

await pass(
    'P2 header backdrop-filter off',
    'header.backdrop-filter, header { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }',
);

await pass(
    'P3 + content-visibility visible',
    'header { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; } .c10-deferred-section { content-visibility: visible !important; contain-intrinsic-size: none !important; }',
);

await pass(
    'P4 + infinite animations paused',
    'header { backdrop-filter: none !important; } .c10-deferred-section { content-visibility: visible !important; contain-intrinsic-size: none !important; } * { animation-play-state: paused !important; }',
);

await pass(
    'P5 + hero blur filters off',
    'header { backdrop-filter: none !important; } .c10-deferred-section { content-visibility: visible !important; contain-intrinsic-size: none !important; } * { animation-play-state: paused !important; } div[class*="filter:blur"] { filter: none !important; }',
);

ws.close();
process.exit(0);
