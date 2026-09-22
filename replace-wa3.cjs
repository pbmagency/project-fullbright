const fs = require('fs');
const c10 = fs.readFileSync('resources/js/pages/cycle10/LandingPage.tsx', 'utf8');
const c12 = fs.readFileSync('resources/js/pages/cycle12/LandingPage.tsx', 'utf8');

const getWaBlock = (str) => {
    const start = str.indexOf('{/* Floating WhatsApp */}');
    // For c10, we want to capture until the end of the floating div.
    // We can just use a regex that matches until the exact closing tag we see.
    // The floating whatsapp wrapper is `<div className="[position:fixed] ..."> ... </div>`
    // Let's just find the last `</a>\n        </div>` after the start.
    const endStr = '</a>\n        </div>';
    let end = str.indexOf(endStr, start);
    return str.slice(start, end + endStr.length);
};

const c10Block = getWaBlock(c10);
const c12Block = getWaBlock(c12);

if (c10Block.length < 100 || c12Block.length < 100) {
    console.log("Error extracting blocks");
    process.exit(1);
}

// Modify c10Block to match the avatar of c12
const modifiedC10Block = c10Block.replace('/assets/admin-avatar.webp', '/assets-c12/admin-avatar.webp');

const newC12 = c12.replace(c12Block, modifiedC10Block);
fs.writeFileSync('resources/js/pages/cycle12/LandingPage.tsx', newC12);
console.log("Success");
