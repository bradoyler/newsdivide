const webshot = require('webshot');
const persist = require('./persist');
const sizeOf = require('image-size');
const PQueue = require('p-queue');
const saveBufferToS3 = persist.saveBufferToS3;
const moment = require('moment-timezone');

function capturePage (page, options, done) {
  let _options = {};
  if (page.options) {
    _options = Object.assign({}, options, page.options);
  } else {
    _options = options;
  }

  return new Promise(function (resolve, reject) {
    console.log('## Start webshot', page.url);
    const renderStream = webshot(page.url, _options);

    let buffers = [];
    renderStream.on('data', function (data) {
      buffers.push(data);
    });

    renderStream.on('error', function (err) {
      buffers = null;
      const errMsg = `Capture error: ${page.url}, ${err}`;
      console.error(errMsg);
      return reject(errMsg);
    });

    renderStream.on('end', function (data) {
      if (!buffers) {
        return reject(Error('No buffers'));
      }

      const buffer = Buffer.concat(buffers);
      let dimensions = null;
      try {
        dimensions = sizeOf(buffer);
      } catch (ex) {
        const errMsg = `error caught: ${ex} ${page.url}`;
        console.error(errMsg);
        return reject(errMsg);
      }

      if (!dimensions || dimensions.width < 300) {
        return reject(Error('insufficient image dimensions'));
      }

      return resolve(buffer);
    });
  });
}

module.exports.queue = function (pages, options, done) {
  const q = new PQueue({ concurrency: 1 });
  const Bucket = options.bucket;
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

    const copyParams = {
      Bucket,
      Key: keyDaily,
      CopySource: Bucket + '/' + keyHourly,
      ACL
    };

    q.add(() => capturePage(page, options))
    .then(result => saveBufferToS3(result, uploadParams))
    .then(data => console.log('>>> saved', data))
    .then(result => persist.copyObject(uploadParams, copyParams))
    .then(result => persist.copyObject(uploadParams, latestCopyParams))
    .then(res => console.log('>>> copied', res))
    .catch(err => console.log(err));
  });
};
