var dotenv = require('dotenv');
dotenv.config({silent: true});
var capture = require('../lib/capture');
var manifest = require('../lib/manifest.json');
// var debug = require('debug')('test');

var options = {
  defaultWhiteBackground: true,
  errorIfStatusIsNot200: true,
  timeout: 21000,
  quality: 95,
  streamType: 'jpg',
  renderDelay: 200,
  screenSize: { width: 375, height: 667 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
};


capture.forEachWebShot(manifest.pages, options);
