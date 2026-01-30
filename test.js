const crypto = require('crypto')

console.log('any thing');

const resetToken = crypto.randomBytes(32).toString('hex');

console.log(resetToken)

