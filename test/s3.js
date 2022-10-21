const html = require('../lib/generateHtml')
const persist = require('../lib/persist')
const moment = require('moment-timezone')
const dayFolder = moment().tz('America/New_York').format('Y-MM-D')

const uploadParams = {
  Key: 'index2.html',
  Bucket: 'newsdivide',
  ContentType: 'text/html',
  ACL: 'public-read'
}

const dailyCopyParams = {
  Bucket: uploadParams.Bucket,
  Key: `day/${dayFolder}/${uploadParams.Key}`,
  CopySource: `${uploadParams.Bucket}/${uploadParams.Key}`,
  ACL: uploadParams.ACL
}

html.compile('../config/left-right.json', '../config/templates/newsdivide.hbs')
  .then(html => {
  // console.log('html:', html);
    return Buffer.from(html)
  })
  .then(html => persist.saveBufferToS3(Buffer.from(html), uploadParams))
  .then(() => persist.copyS3Object(uploadParams, dailyCopyParams))
  .then(console.log)
