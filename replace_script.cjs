const fs = require('fs');
const path = require('path');
const dir = path.join('d:', 'sewaan-website-vcom', 'src', 'pages');

fs.readdirSync(dir).forEach(file => {
  if (!file.endsWith('.jsx')) return;
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');

  // Skip Rentals.jsx as it's already done
  if (file === 'Rentals.jsx') return;

  const searchRegex = /<div className=\"relative[^\"]*\">\s*<Search[^>]*\/>\s*<input[^>]*placeholder=\"([^\"]+)\"[^>]*value={([^}]+)}[^>]*onChange={\([^)]+\)\s*=>\s*([a-zA-Z0-9_]+)\([^)]+\)}[^>]*\/>\s*<\/div>/g;

  let hasReplacement = false;
  content = content.replace(searchRegex, (match, placeholder, value, setter) => {
    hasReplacement = true;
    return `<AnimatedSearchInput value={${value}} onChange={(e) => ${setter}(e.target.value)} placeholder="${placeholder}" />`;
  });

  // Also replace `<Search` without the container if it's structured slightly differently
  // wait, let's just stick to the main regex and see what it catches.
  
  if (hasReplacement) {
    if (!content.includes('import AnimatedSearchInput')) {
      content = content.replace(/import PageWrapper from '\.\.\/components\/layout\/PageWrapper';/, "import PageWrapper from '../components/layout/PageWrapper';\nimport AnimatedSearchInput from '../components/ui/AnimatedSearchInput';");
    }
    fs.writeFileSync(p, content);
    console.log('Updated ' + file);
  }
});
