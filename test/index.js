/* eslint-disable no-unused-vars */
const dotenv = require('dotenv');
dotenv.config({silent: true});
const CronJob = require('cron').CronJob;
// const capture = require('../lib/capture');
const captureQueue = require('../lib/captureQueue');
const testManifest = require('../lib/test-manifest.json');
const debug = require('debug')('test');
const cronScheduleB = '1 34 9-18 * * *';

const mobileAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
const desktopAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';

const options = {
  defaultWhiteBackground: true,
  errorIfStatusIsNot200: true,
  errorIfJSException: false,
  timeout: 65000,
  quality: 95,
  streamType: 'jpg',
  renderDelay: 200,
  screenSize: { width: 375, height: 667 },
  userAgent: desktopAgent
};

// debug('defaults ~', options);
captureQueue.batch(testManifest.pages, options);

const jobB = new CronJob(cronScheduleB, function () {
  debug('>>> cron', new Date());
  // capture.forEachWebShot(manifest.pages, options);
}, null, true, 'America/New_York');
