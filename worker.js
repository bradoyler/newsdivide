/* eslint-disable no-unused-vars */
var dotenv = require('dotenv');
dotenv.config({silent: true});
var CronJob = require('cron').CronJob;
var capture = require('./lib/capture');
var manifest = require('./lib/manifest.json');
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
const cronScheduleA = '1 2 1,6 * * *';
const cronScheduleB = '1 2 9-18,20 * * *';
const cronScheduleC = '1 2 20 * * *';

const defaults = {
  defaultWhiteBackground: true,
  errorIfStatusIsNot200: true,
  timeout: 65000,
  quality: 95,
  streamType: 'jpg',
  renderDelay: 1800,
  screenSize: { width: 375, height: 667 },
  userAgent: userAgent
};

console.log('starting...');
capture.forEachWebShot(manifest.pages, defaults);

var jobA = new CronJob(cronScheduleA, function () {
  var options = defaults;
  capture.forEachWebShot(manifest.pages, options);
}, null, true, 'America/New_York');

var jobB = new CronJob(cronScheduleB, function () {
  var options = defaults;
  capture.forEachWebShot(manifest.pages, options);
}, null, true, 'America/New_York');

var jobC = new CronJob(cronScheduleC, function () {
  var options = defaults;
  capture.forEachWebShot(manifest.pages, options);
}, null, true, 'America/New_York');
