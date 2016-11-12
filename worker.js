var dotenv = require('dotenv');
dotenv.config({silent: true});
var CronJob = require('cron').CronJob
var webshot = require('webshot');
var persist = require('./lib/persist');

new CronJob('* 11 8-19 * * *', function(){
  run();
}, null, true, 'America/New_York');

function run() {
//var saveStream = persist.saveStreamToFile;
  var saveStream = persist.saveStreamToS3;

  var options = {
    errorIfStatusIsNot200: true,
    timeout: 95000,
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
    'http://m.huffpost.com',
    'http://www.bloomberg.com',
    'https://newsblock.io'
  ];

  function forEachWebShot(urls) {
    var url = urls.shift();

    if (!url) {
      return;
    }

    console.log('>> start webshot', url);

    var filename = url.replace(/^(http|https):\/\//, '')
        .replace(/\//g,'_') + '.jpg';

    if (url === 'http://idrudgereport.com') {
      options.shotOffset = { left: 0, right: 0, top: 280, bottom: 0 };
    } else {
      options.shotOffset = { left: 0, right: 0, top: 0, bottom: 0 };
    }
    var renderStream = webshot(url, options);

    renderStream.on('error', function (err) {
      console.log('stream.error!!', url, err);
      forEachWebShot(urls);
    });

    saveStream(renderStream, filename, function (err, data) {
      console.log('saved stream >>>', err, data);
      forEachWebShot(urls);
    });
  }

  forEachWebShot(pageUrls);
}
