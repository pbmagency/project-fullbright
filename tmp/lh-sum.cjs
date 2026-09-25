const fs = require('fs');
const file = process.argv[2] || 'lighthouse-c10.json';
const r = JSON.parse(fs.readFileSync(file, 'utf8'));
const a = r.audits;

console.log('### AUDIT KEYS');
console.log(Object.keys(a).join('\n'));

const show = (id, n = 6) => {
  const au = a[id];
  if (!au) return console.log(`--- ${id}: MISSING`);
  console.log(`\n--- ${id} | score=${au.score} | ${au.displayValue || ''}`);
  const items = au.details?.items || [];
  const arr = Array.isArray(items) ? items : Object.entries(items).map(([k, v]) => ({ k, v }));
  arr.slice(0, n).forEach((i, idx) => console.log(idx, JSON.stringify(i).slice(0, 700)));
};

if (process.argv[3]) {
  process.argv.slice(3).forEach((id) => show(id));
}
