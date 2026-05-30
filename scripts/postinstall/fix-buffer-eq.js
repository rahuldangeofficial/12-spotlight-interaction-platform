const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const files = execSync('find . -name "buffer-equal-constant-time" -type d', { encoding: 'utf8' }).split('\n').filter(Boolean);

const newContent = `/*jshint node:true */
'use strict';
var Buffer = require('buffer').Buffer;
var SlowBuffer = require('buffer').SlowBuffer;

module.exports = bufferEq;

function bufferEq(a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  var c = 0;
  for (var i = 0; i < a.length; i++) {
    c |= a[i] ^ b[i];
  }
  return c === 0;
}

bufferEq.install = function() {
  Buffer.prototype.equal = function equal(that) {
    return bufferEq(this, that);
  };
  if (SlowBuffer && SlowBuffer.prototype) {
    SlowBuffer.prototype.equal = Buffer.prototype.equal;
  }
};

var origBufEqual = Buffer.prototype.equal;
var origSlowBufEqual = SlowBuffer && SlowBuffer.prototype ? SlowBuffer.prototype.equal : undefined;

bufferEq.restore = function() {
  Buffer.prototype.equal = origBufEqual;
  if (SlowBuffer && SlowBuffer.prototype) {
    SlowBuffer.prototype.equal = origSlowBufEqual;
  }
};
`;

files.forEach(dir => {
  const filePath = path.join(dir, 'index.js');
  if (fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, newContent);
    console.log('Patched', filePath);
  }
});
