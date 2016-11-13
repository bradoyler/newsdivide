var dotenv = require('dotenv');
dotenv.config({silent: true});
var CronJob = require('cron').CronJob
var capture = require('./lib/capture');

new CronJob('* 11 8-19 * * *', function(){
  run();
}, null, true, 'America/New_York');

function run() {

  var options = {
    defaultWhiteBackground: true,
    errorIfStatusIsNot200: true,
    timeout: 55000,
    quality: 95,
    streamType: 'jpg',
    renderDelay: 1200,
    screenSize: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
  };

  var pageUrls = [
    'http://abcnews.go.com',
    'http://www.npr.org',
    'http://idrudgereport.com',
    'http://www.nbcnews.com',
    'http://www.nbcnews.com/politics/2016-election',
    'http://www.cnn.com',
    'http://www.cnn.com/politics',
    'http://www.foxnews.com',
    'http://www.nytimes.com',
    'https://www.washingtonpost.com',
    'http://time.com',
    'http://www.wsj.com',
    'https://news.vice.com',
    'http://www.latimes.com',
    'http://qz.com',
    'http://www.bloomberg.com',
    'http://m.huffpost.com',
    'https://newsblock.io'
  ];

  capture.forEachWebShot(pageUrls, options);
}
