const fs = require('fs');
const path = require('path');

const mappings = {
  // Backgrounds
  'bg-white': 'dark:bg-slate-900',
  'bg-slate-50': 'dark:bg-slate-950',
  'bg-slate-100': 'dark:bg-slate-800',
  'bg-slate-200': 'dark:bg-slate-700',
  'bg-slate-800': 'dark:bg-slate-100',
  'bg-slate-900': 'dark:bg-slate-50',
  
  // Text
  'text-slate-900': 'dark:text-white',
  'text-slate-800': 'dark:text-slate-100',
  'text-slate-700': 'dark:text-slate-200',
  'text-slate-600': 'dark:text-slate-300',
  'text-slate-500': 'dark:text-slate-400',
  'text-white': 'dark:text-slate-900',

  // Borders
  'border-white': 'dark:border-slate-900',
  'border-slate-100': 'dark:border-slate-800',
  'border-slate-200': 'dark:border-slate-700',
  'border-slate-300': 'dark:border-slate-600',
};

function injectDarkClasses(content) {
  // Match both className="..." and className={`...`}
  const classRegex = /className=(?:(["'])(.*?)\1|{`([^`]*)`})/g;
  
  return content.replace(classRegex, (match, quote, p2, p3) => {
    let classesStr = p2 || p3;
    if (!classesStr) return match;

    let classes = classesStr.split(/\s+/);
    let injectedClasses = [];

    classes.forEach(cls => {
      // If it's already a dark class or dynamic expression, ignore
      if (cls.startsWith('dark:') || cls.includes('${')) return;
      
      // Remove any prefix like hover: or focus: to find the base mapped class
      const parts = cls.split(':');
      const baseClass = parts[parts.length - 1];
      const prefixes = parts.slice(0, -1);

      if (mappings[baseClass]) {
        // Construct the dark variant
        // If it had a prefix like hover:bg-white, it becomes dark:hover:bg-slate-900
        const darkVariant = mappings[baseClass].replace('dark:', 'dark:' + (prefixes.length > 0 ? prefixes.join(':') + ':' : ''));
        
        // Only inject if it doesn't already exist
        if (!classesStr.includes(darkVariant)) {
          injectedClasses.push(darkVariant);
        }
      }
    });

    if (injectedClasses.length > 0) {
      if (p2) { // className="..."
        return `className="${classesStr} ${injectedClasses.join(' ')}"`;
      } else if (p3) { // className={`...`}
        return `className={\`${classesStr} ${injectedClasses.join(' ')}\`}`;
      }
    }
    return match;
  });
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let originalContent = fs.readFileSync(fullPath, 'utf8');
      let newContent = injectDarkClasses(originalContent);
      
      if (originalContent !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

walk(path.join(__dirname, 'src'));
