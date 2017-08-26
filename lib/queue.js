const PQueue = require('p-queue');
const moment = require('moment-timezone');
const capture = require('./captureChrome');
const persist = require('./persist');
const saveBufferToS3 = persist.saveBufferToS3;

module.exports = async function (_pages, defaults) {
  const Bucket = defaults.Bucket;
  const q = new PQueue({ concurrency: 1 });
  const hour = moment().tz('America/New_York').format('HH');
  const dayFolder = moment().tz('America/New_York').format('Y-MM-D');
  const ACL = 'public-read';
  const ContentType = 'image/jpeg';

  let idx = 0;
  const origPages = _pages.slice();
  const pages = _pages.slice();

  async function run (page) {
    if (!page) {
      console.log(`>>> Done ${origPages.length} pages`);
      return;
    }
    const keyHourly = `day/${dayFolder}/${hour}/${page.image}`;
    const keyDaily = `day/${dayFolder}/${page.image}`;

    const uploadParams = { Bucket, Key: keyHourly, ContentType, ACL };

    const latestCopyParams = {
      Bucket,
      Key: page.image,
      CopySource: `${Bucket}/${keyHourly}`,
      ACL
    };

    const dailyCopyParams = {
      Bucket,
      Key: keyDaily,
      CopySource: `${Bucket}/${keyHourly}`,
      ACL
    };

    const browser = await capture.launch();
    q.add(() => capture.page(page, defaults, browser))
    .then(result => saveBufferToS3(result, uploadParams))
    .then(data => console.log('>>> saved:', data.Location))
    .then(() => persist.copyS3Object(uploadParams, dailyCopyParams))
    .then(() => persist.copyS3Object(uploadParams, latestCopyParams))
    .then(res => {
      idx += 1;
      console.log('>>> copied:', latestCopyParams.CopySource, 'page:', idx, 'of', origPages.length);
      browser.close();
      run(pages.shift());
    })
    .catch(err => {
      console.error(err);
      browser.close();
      run(pages.shift());
    });
  }

  run(pages.shift());
};
