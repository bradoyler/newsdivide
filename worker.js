var dotenv = require('dotenv');
dotenv.config({silent: true});
var CronJob = require('cron').CronJob;
var capture = require('./lib/capture');
var manifest = require('./lib/manifest.json');

console.log('starting CRON...');

var jobA = new CronJob('1 2 10-22 * * *', function () {
  var options = {
    defaultWhiteBackground: true,
    errorIfStatusIsNot200: true,
    timeout: 65000,
    quality: 95,
    streamType: 'jpg',
    renderDelay: 1800,
    screenSize: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
  };

  capture.forEachWebShot(manifest.pages, options);
}, null, true, 'America/New_York');

//jobA.start();
