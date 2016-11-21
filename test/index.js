/* eslint-disable no-unused-vars */
var dotenv = require('dotenv');
dotenv.config({silent: true});
var CronJob = require('cron').CronJob;
var capture = require('../lib/capture');
var manifest = require('../lib/test-manifest.json');
//var debug = require('debug')('test');
const cronScheduleB = '1 34 9-18 * * *';

var options = {
  defaultWhiteBackground: true,
  errorIfStatusIsNot200: true,
  timeout: 65000,
  quality: 95,
  streamType: 'jpg',
  renderDelay: 200,
  screenSize: { width: 375, height: 667 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
};

capture.forEachWebShot(manifest.pages, options);

var jobB = new CronJob(cronScheduleB, function () {
  console.log('>>> cron', new Date());
}, null, true, 'America/New_York');
