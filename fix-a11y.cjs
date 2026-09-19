const fs = require('fs');
const file = 'resources/js/pages/cycle10/LandingPage.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('aria-label="Putar video tampilan LMS"', 'aria-label="Putar showcase LMS"');
fs.writeFileSync(file, content);
