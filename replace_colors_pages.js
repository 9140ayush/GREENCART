const fs = require('fs');
const path = require('path');

const directory = 'e:/GREENCART/client/src/pages';

const replacements = [
  { from: /#E8A838/gi, to: '#3BB77E' },
  { from: /rgba\(232,\s*168,\s*56,/gi, to: 'rgba(59, 183, 126,' },
];

function replaceColors(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceColors(fullPath);
    } else if (fullPath.match(/\.(js|jsx)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { from, to } of replacements) {
        content = content.replace(from, to);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

replaceColors(directory);
console.log('Done replacing remaining colors.');
