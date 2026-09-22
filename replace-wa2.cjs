const fs = require('fs');

const c10Path = 'resources/js/pages/cycle10/LandingPage.tsx';
const c12Path = 'resources/js/pages/cycle12/LandingPage.tsx';

const c10 = fs.readFileSync(c10Path, 'utf8');
const c12 = fs.readFileSync(c12Path, 'utf8');

const regex = /\{\/\* Floating WhatsApp \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/>/g;

const c10Matches = c10.match(regex);
const c12Matches = c12.match(regex);

if (!c10Matches || c10Matches.length === 0) {
    console.log("No c10 match"); process.exit(1);
}
if (!c12Matches || c12Matches.length === 0) {
    console.log("No c12 match"); process.exit(1);
}

const c10Block = c10Matches[c10Matches.length - 1]; // get the last match if multiple
const c12Block = c12Matches[c12Matches.length - 1];

// replace image src in c10Block
const newBlock = c10Block.replace(/\/assets\/admin-avatar\.webp/g, '/assets-c12/admin-avatar.webp');

const newC12 = c12.replace(c12Block, newBlock);

fs.writeFileSync(c12Path, newC12);
console.log("Success");
