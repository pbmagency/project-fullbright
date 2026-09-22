const fs = require('fs');

const c10Path = 'resources/js/pages/cycle10/LandingPage.tsx';
const c12Path = 'resources/js/pages/cycle12/LandingPage.tsx';

const c10 = fs.readFileSync(c10Path, 'utf8');
const c12 = fs.readFileSync(c12Path, 'utf8');

const c10Match = c10.match(/\{\/\* Floating WhatsApp \*\/\}[\s\S]+?<\/div>\s+<\/div>\s+<\/div>\s+<\/>/);
if (!c10Match) {
  console.log('Failed to find c10 block');
  process.exit(1);
}

// Extract just the block up to the last </div> before the page ends.
// Wait, c10 ends with:
//         </div>
//       
//         </div>
//       </div>
//     </>
//   );
// }
// Let's use string splitting.
const c10Block = c10.substring(
    c10.indexOf('{/* Floating WhatsApp */}'),
    c10.indexOf('</>')
);

let c12Block = c12.substring(
    c12.indexOf('{/* Floating WhatsApp */}'),
    c12.indexOf('</>')
);

if (!c12Block || !c10Block) {
    console.log("Could not find blocks");
    process.exit(1);
}

// Replace image src in c10 block to use c12's image.
// Actually, I can just use c10Block directly, but let's replace /assets/admin-avatar.webp with /assets-c12/admin-avatar.webp
const newBlock = c10Block.replace('/assets/admin-avatar.webp', '/assets-c12/admin-avatar.webp');

const newC12 = c12.replace(c12Block, newBlock);
fs.writeFileSync(c12Path, newC12);
console.log('Done');
