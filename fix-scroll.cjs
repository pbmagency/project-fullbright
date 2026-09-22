const fs = require('fs');

// 1. Fix LandingPage.tsx scroll-margin-top
const file1 = 'resources/js/pages/cycle12/LandingPage.tsx';
let content1 = fs.readFileSync(file1, 'utf8');
content1 = content1.replace('<section id="pricing" className="max-[559px]:[padding:48px_16px_40px] [background:#fff] [padding:72px_24px_56px]">', '<section id="pricing" className="max-[559px]:[padding:48px_16px_40px] [background:#fff] [padding:72px_24px_56px] [scroll-margin-top:102px]">');
fs.writeFileSync(file1, content1);

// 2. Fix landing-app.tsx scrolling logic
const file2 = 'resources/js/landing-app.tsx';
let content2 = fs.readFileSync(file2, 'utf8');

const oldScroll = `document.querySelector(destination)?.scrollIntoView({ behavior: 'smooth', block: 'start' });`;
const newScroll = `
            // Try scrolling multiple times to catch delayed React mounts and layout shifts
            let attempts = 0;
            const tryScroll = () => {
                const el = document.querySelector(destination);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                attempts++;
                if (attempts < 5) {
                    setTimeout(tryScroll, 150);
                }
            };
            tryScroll();
`;

content2 = content2.replace(oldScroll, newScroll);
fs.writeFileSync(file2, content2);
console.log('Done fixing scroll and margin');
