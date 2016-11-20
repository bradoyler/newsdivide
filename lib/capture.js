var webshot = require('webshot');
var mod = module.exports = {};
var persist = require('./persist');
//var saveStream = persist.saveStreamToFile;
var saveBuffer = persist.saveBufferToS3;

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

  var buffers = [];
  renderStream.on('data', function (data) {
    buffers.push(data);
  });

  renderStream.on('error', function (err) {
    buffers = null;
    console.log('Capture ERR:', err);
    pages.push(page); // add url back for retry
    mod.forEachWebShot(pages, options);
  });

  renderStream.on('end', function (data) {
    if (!buffers) {
      return;
    }

    var buffer = Buffer.concat(buffers);

    saveBuffer(buffer, page.image, function (err, data) {
      if (!err) {
        console.log('>> Saved:', data.Location);
      } else {
        console.log('>> Save Error:', page.url, err, _options.timeout, pages.length, 'togo...');
        pages.push(page); // add url back for retry
      }

      mod.forEachWebShot(pages, options);
    });
  });
};
