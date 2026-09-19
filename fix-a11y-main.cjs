const fs = require('fs');
const file = 'resources/js/pages/cycle10/LandingPage.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('<div className="[min-height:100vh] [background:#f3f4f6]">', '<main className="[min-height:100vh] [background:#f3f4f6]">');
content = content.replace(/<\/div>\s*<\/>\s*$/m, '</main>\n    </>');
fs.writeFileSync(file, content);
