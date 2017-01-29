/* eslint-disable no-unused-vars */
var dotenv = require('dotenv');
dotenv.config({silent: true});
var CronJob = require('cron').CronJob;
var capture = require('./lib/capture');
const html = require('./lib/generateHtml');
var manifestCache = require('./lib/manifest.json');
var manifest = JSON.parse(JSON.stringify(manifestCache));
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
const cronScheduleA = '1 2 1,6 * * *';
const cronScheduleB = '1 */15 9-18 * * *';
const cronScheduleC = '1 2 20 * * *';
// const cron5pmDaily = '1 05 17 * * *';

const defaults = {
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

var jobA = new CronJob(cronScheduleA, function () {
  console.log('>>> cron A:', cronScheduleA, new Date());
  var options = defaults;
  manifest = JSON.parse(JSON.stringify(manifestCache));
  capture.forEachWebShot(manifest.pages, options);
  html.compile();
}, null, true, 'America/New_York');

var jobB = new CronJob(cronScheduleB, function () {
  console.log('>>> cron B:', cronScheduleB, new Date());
  var options = defaults;
  manifest = JSON.parse(JSON.stringify(manifestCache));
  capture.forEachWebShot(manifest.pages, options);
}, null, true, 'America/New_York');

var jobC = new CronJob(cronScheduleC, function () {
  console.log('>>> cron C:', cronScheduleC, new Date());
  var options = defaults;
  manifest = JSON.parse(JSON.stringify(manifestCache));
  capture.forEachWebShot(manifest.pages, options);
}, null, true, 'America/New_York');

// var jobDaily = new CronJob(cron5pmDaily, function () {
//   console.log('>>> cronDaily', new Date());
//   dailyDivide.compile();
// }, null, true, 'America/New_York');

// startup run...
capture.forEachWebShot(manifest.pages, defaults);
