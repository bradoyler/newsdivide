const html = require('../lib/generateHtml')
const persist = require('../lib/persist')

html.compile('./lib/data/left-right.json', './lib/templates/newsdivide.hbs')
  .then(html => Buffer.from(html))
  .then(buf => persist.saveBufferToFile(buf, 'test.html'))
// .then(() => persist.copyS3Object(uploadParams, dailyCopyParams))
  .then(console.log)
  .catch(console.log)
