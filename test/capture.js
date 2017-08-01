const capture = require('../lib/capture');
const manifestCache = require('../lib/data/test-manifest.json');
let manifest = JSON.parse(JSON.stringify(manifestCache));

const defaults = {
  Bucket: 'newsdivide',
  defaultWhiteBackground: true,
  errorIfStatusIsNot200: true,
  timeout: 65000,
  quality: 95,
  streamType: 'jpg',
  renderDelay: 2800,
  screenSize: { width: 375, height: 667 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
};

capture.page(manifest.pages[0], defaults);
