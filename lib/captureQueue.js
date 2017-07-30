const webshot = require('webshot');
const mod = module.exports = {};
const persist = require('./persist');
const sizeOf = require('image-size');
const queue = require('queue');
const saveBuffer = persist.saveBufferToS3;

function capturePage (page, options, done) {
  let _options = {};
  if (page.options) {
    _options = Object.assign({}, options, page.options);
  } else {
    _options = options;
  }

  console.log('## Start webshot', page.url);
  const renderStream = webshot(page.url, _options);
  // const streamErrors = [];

  let buffers = [];
  renderStream.on('data', function (data) {
    buffers.push(data);
  });

  renderStream.on('error', function (err) {
    buffers = null;
    const errMsg = `Capture error: ${page.url}, ${err}`;
    console.error(errMsg);
    done(errMsg);
  });

  renderStream.on('end', function (data) {
    if (!buffers) {
      return done('No buffers');
    }

    const buffer = Buffer.concat(buffers);
    let dimensions = null;
    try {
      dimensions = sizeOf(buffer);
    } catch (ex) {
      const errMsg = `error caught: ${ex} ${page.url}`;
      console.error(errMsg);
      return done(errMsg);
    }

    if (!dimensions || dimensions.width < 300) {
      return done('insufficient image dimensions');
    }

    done(null, buffer);
  });
}

mod.batch = function (pages, options, done) {
  const q = queue({ autostart: true, concurrency: 1 });
  const captureResults = [];

  q.on('success', function (page) {
    const uploadOptions = { bucket: 'newsdivide.bradoyler.com', key: page.image, contentType: 'image/jpeg' };
    saveBuffer(page.buffer, uploadOptions, function (err, data) {
      if (!err) {
        console.log('>> Saved image:', data.Location);
      } else {
        console.error('>> Saved error:', page.url, err, pages.length, 'togo...');
      }
    });

    console.log('job finished:', page.image);
  });

  q.on('error', function (err) {
    console.log('Error:', err);
  });

  q.on('end', function () {
    console.log('jobs completed:', captureResults.length);
  });

  pages.forEach(function (page) {
    q.push(function (cb) {
      capturePage(page, options, function (err, buffer) {
        captureResults.push(page);
        page.buffer = buffer;
        cb(err, page);
      });
    });
  });
};
