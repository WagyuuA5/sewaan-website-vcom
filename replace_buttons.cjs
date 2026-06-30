const fs = require('fs');
const path = require('path');

const dirs = [
  path.join('d:', 'sewaan-website-vcom', 'src', 'pages'),
  path.join('d:', 'sewaan-website-vcom', 'src', 'components', 'ui'),
  path.join('d:', 'sewaan-website-vcom', 'src', 'components', 'layout')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.jsx')) return;
    const p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');

    let hasReplacement = false;
    
    // Replace <button ...>{isSaving ? ... : 'Simpan Perubahan'}</button>
    const buttonRegex = /<button([^>]*)>([\s\S]*?)<\/button>/g;
    
    content = content.replace(buttonRegex, (match, props, inner) => {
      // Don't replace icon-only buttons or pagination buttons
      if (inner.includes('<Menu') || inner.includes('<Search') || inner.includes('<Bell') || inner.includes('<LogOut')) return match;
      if (props.includes('Pagination')) return match;

      if (inner.includes('Simpan') || inner.includes('Keluar') || inner.includes('Tambah') || inner.includes('Export') || inner.includes('Login')) {
        hasReplacement = true;
        return `<ShinyButton${props}>${inner}</ShinyButton>`;
      }
      return match;
    });

    if (hasReplacement) {
      if (!content.includes('import { ShinyButton }')) {
        let relativePath = '';
        if (dir.includes('pages')) relativePath = '../components/ui/shiny-button';
        else if (dir.includes('layout')) relativePath = '../ui/shiny-button';
        else if (dir.includes('ui')) relativePath = './shiny-button';
        
        const importMatch = content.match(/import .* from .*;(\r?\n)/);
        if (importMatch) {
          content = content.replace(importMatch[0], `${importMatch[0]}import { ShinyButton } from '${relativePath}';\n`);
        } else {
          content = `import { ShinyButton } from '${relativePath}';\n` + content;
        }
      }
      fs.writeFileSync(p, content);
      console.log('Updated ' + file);
    }
  });
});
