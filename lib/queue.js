const PQueue = require('p-queue');
const moment = require('moment-timezone');
const capture = require('./capture');
const persist = require('./persist');
const saveBufferToS3 = persist.saveBufferToS3;

module.exports = function (pages, options) {
  const q = new PQueue({ concurrency: 1 });
  const Bucket = options.Bucket;
  const hour = moment().tz('America/New_York').format('HH');
  const dayFolder = moment().tz('America/New_York').format('Y-MM-D');
  const ACL = 'public-read';
  const ContentType = options.contentType || 'image/jpeg';

  pages.forEach(page => {
    const keyHourly = `day/${dayFolder}/${hour}/${page.image}`;
    const keyDaily = `day/${dayFolder}/${page.image}`;

    const uploadParams = { Bucket, Key: keyHourly, ContentType, ACL };

    const latestCopyParams = {
      Bucket,
      Key: page.image,
      CopySource: Bucket + '/' + keyHourly,
      ACL
    };

    const dailyCopyParams = {
      Bucket,
      Key: keyDaily,
      CopySource: Bucket + '/' + keyHourly,
      ACL
    };

    q.add(() => capture.page(page, options))
    .then(result => saveBufferToS3(result, uploadParams))
    .then(data => console.log('>>> saved:', data.Location))
    .then(() => persist.copyS3Object(uploadParams, dailyCopyParams))
    .then(() => persist.copyS3Object(uploadParams, latestCopyParams))
    .then(res => console.log('>>> copied:', latestCopyParams.CopySource))
    .catch(console.error);
  });
};
