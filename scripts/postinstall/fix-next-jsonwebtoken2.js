const fs = require('fs');
const filePath = 'node_modules/next/dist/compiled/jsonwebtoken/index.js';

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // We need to be careful as we already modified it once.
  // First, let's restore it to something easier to patch or just patch the patched version.
  
  // Replace `if(i.prototype)` with `if(i&&i.prototype)`
  content = content.replace(/if\(i\.prototype\)/g, 'if(i&&i.prototype)');
  
  // Replace `i.prototype?` with `(i&&i.prototype)?`
  content = content.replace(/i\.prototype\?/g, '(i&&i.prototype)?');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Patched Next.js minified jsonwebtoken (second pass)');
} else {
  console.log('Next.js minified jsonwebtoken not found');
}
