const fs = require('fs');
const file = 'resources/js/pages/cycle12/LandingPage.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `const measure = (): void => setBannerH(bannerRef.current ? Math.round(bannerRef.current.getBoundingClientRect().height) : 0);`;

const replacement = `const measure = (): void => {
      const b = document.querySelector('.c12-banner');
      if (b) {
        setBannerH(Math.round(b.getBoundingClientRect().height));
      } else {
        setBannerH(bannerRef.current ? Math.round(bannerRef.current.getBoundingClientRect().height) : 0);
      }
    };`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
console.log('Done');
