/* eslint-disable no-unused-vars */
const dotenv = require('dotenv');
dotenv.config({silent: true});
const CronJob = require('cron').CronJob;
const capture = require('../lib/capture');
const manifest = require('../lib/test-manifest.json');
const debug = require('debug')('test');
const cronScheduleB = '1 34 9-18 * * *';

const options = {
  defaultWhiteBackground: true,
  errorIfStatusIsNot200: true,
  errorIfJSException: false,
  timeout: 65000,
  quality: 95,
  streamType: 'jpg',
  renderDelay: 200,
  screenSize: { width: 375, height: 667 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
};

debug('defaults ~', options);
capture.forEachWebShot(manifest.pages, options);

const jobB = new CronJob(cronScheduleB, function () {
  debug('>>> cron', new Date());
  // capture.forEachWebShot(manifest.pages, options);
}, null, true, 'America/New_York');
