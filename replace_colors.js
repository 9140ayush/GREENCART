const fs = require('fs');
const path = require('path');

const directory = 'e:/GREENCART/client/src';

const replacements = [
  { from: /#1A3C2E/gi, to: '#3BB77E' },
  { from: /#2D6A4F/gi, to: '#29A56C' },
  { from: /rgba\(26,\s*60,\s*46,/gi, to: 'rgba(59, 183, 126,' },
];

function replaceColors(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceColors(fullPath);
    } else if (fullPath.match(/\.(js|jsx|css)$/)) {
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
console.log('Done replacing colors.');
