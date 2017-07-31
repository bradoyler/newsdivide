/* eslint-disable no-unused-vars */
const dotenv = require('dotenv');
dotenv.config({silent: true});
const CronJob = require('cron').CronJob;
const capture = require('./lib/captureQueue');
const html = require('./lib/generateHtml');
const manifestCache = require('./lib/manifest.json');
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
const cronScheduleA = '1 2 1,5,6,7,8 * * *';
const cronScheduleB = '1 */15 9-18 * * *';
const cronScheduleC = '1 2 20 * * *';
// const cron5pmDaily = '1 05 17 * * *';
let manifest = JSON.parse(JSON.stringify(manifestCache));

const defaults = {
  bucket: 'newsdivide.bradoyler.com',
  defaultWhiteBackground: true,
  errorIfStatusIsNot200: true,
  timeout: 65000,
  quality: 95,
  streamType: 'jpg',
  renderDelay: 2800,
  screenSize: { width: 375, height: 667 },
  userAgent: userAgent
};

console.log('starting...');
html.compile();

const jobA = new CronJob(cronScheduleA, function () {
  console.log('>>> cron A:', cronScheduleA, new Date());
  var options = defaults;
  manifest = JSON.parse(JSON.stringify(manifestCache));
  capture.queue(manifest.pages, options);
  html.compile();
}, null, true, 'America/New_York');

const jobB = new CronJob(cronScheduleB, function () {
  console.log('>>> cron B:', cronScheduleB, new Date());
  var options = defaults;
  manifest = JSON.parse(JSON.stringify(manifestCache));
  capture.queue(manifest.pages, options);
}, null, true, 'America/New_York');

const jobC = new CronJob(cronScheduleC, function () {
  console.log('>>> cron C:', cronScheduleC, new Date());
  var options = defaults;
  manifest = JSON.parse(JSON.stringify(manifestCache));
  capture.queue(manifest.pages, options);
}, null, true, 'America/New_York');

// const jobDaily = new CronJob(cron5pmDaily, function () {
//   console.log('>>> cronDaily', new Date());
//   dailyDivide.compile();
// }, null, true, 'America/New_York');

// startup run...
capture.queue(manifest.pages, defaults);
