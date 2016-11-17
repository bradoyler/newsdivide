var webshot = require('webshot');
var mod = module.exports = {};
var persist = require('./persist');
//var saveStream = persist.saveStreamToFile;
var saveStream = persist.saveStreamToS3;

mod.forEachWebShot = function (pages, options) {
  var page = pages.shift();

  if (!page) {
    return;
  }

  console.log('## Start webshot', page.url);

  var _options = {};
  if (page.options) {
    _options = Object.assign({}, options, page.options);
  } else {
    _options = options;
  }

  var renderStream = webshot(page.url, _options);

  saveStream(renderStream, page.image, function (err, data) {
    if (!err) {
      console.log('>> Saved:', data.Location);
    } else {
      console.log('>> Capture Error:', page.url, err, _options.timeout, pages.length, 'togo...');
      pages.push(page); // add url back for retry
    }

    mod.forEachWebShot(pages, options);
  });
};
