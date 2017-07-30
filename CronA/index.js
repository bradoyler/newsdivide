const html = require('../lib/generateHtml');
const manifestCache = require('../lib/manifest.json');
const capture = require('../lib/captureQueue');
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';

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

let manifest = JSON.parse(JSON.stringify(manifestCache));

module.exports = function (context, myTimer) {
  context.log('>>> cron A:');
  const timeStamp = new Date().toISOString();
  manifest = JSON.parse(JSON.stringify(manifestCache));
  capture.batch(manifest.pages, defaults, function () {
    context.log('TimeTrigger2 function ran!', timeStamp);
    context.done();
  });
  html.compile();

  if (myTimer.isPastDue) {
    context.log('JavaScript is running late!');
  }
};
