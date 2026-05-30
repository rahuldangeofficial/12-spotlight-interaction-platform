const fs = require('fs');
const filePath = 'node_modules/next/dist/compiled/jsonwebtoken/index.js';

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(
    /n\.prototype\.equal=i\.prototype\.equal=function equal\(e\)\{return bufferEq\(this,e\)\}/g,
    'n.prototype.equal=function equal(e){return bufferEq(this,e)};if(i.prototype)i.prototype.equal=n.prototype.equal'
  );

  content = content.replace(
    /var o=i\.prototype\.equal;/g,
    'var o=i.prototype?i.prototype.equal:undefined;'
  );

  content = content.replace(
    /i\.prototype\.equal=o/g,
    'if(i.prototype)i.prototype.equal=o'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Patched Next.js minified jsonwebtoken');
} else {
  console.log('Next.js minified jsonwebtoken not found');
}
