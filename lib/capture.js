const webshot = require('webshot');
const mod = module.exports = {};
const persist = require('./persist');
const sizeOf = require('image-size');
// const saveStream = persist.saveStreamToFile;
const saveBuffer = persist.saveBufferToS3;

function retryPageCapture (pages, page, options) {
  if (page.retryCount) {
    page.retryCount --;
    pages.push(page);
    mod.forEachWebShot(pages, options);
  }
}

mod.forEachWebShot = function (pages, options, done) {
  // support no callack
  if (!done) {
    done = function () {};
  }

  const page = pages.shift();

  if (!page) {
    done();
    return;
  }

  let _options = {};
  if (page.options) {
    _options = Object.assign({}, options, page.options);
  } else {
    _options = options;
  }

  console.log('## Start webshot', page.url);
  const renderStream = webshot(page.url, _options);

  let buffers = [];
  renderStream.on('data', function (data) {
    buffers.push(data);
  });

  renderStream.on('error', function (err) {
    buffers = null;
    console.error('Capture error:', page.url, err);
    retryPageCapture(pages, page, options);
  });

  renderStream.on('end', function (data) {
    if (!buffers) {
      retryPageCapture(pages, page, options);
      return;
    }

    const buffer = Buffer.concat(buffers);
    let dimensions = null;
    try {
      dimensions = sizeOf(buffer);
    } catch (ex) {
      console.error('error caught:', ex, page.url);
      retryPageCapture(pages, page, options);
      return;
    }

    if (!dimensions || dimensions.width < 300) {
      retryPageCapture(pages, page, options);
      return;
    }

    const uploadOptions = {bucket: 'newsdivide.bradoyler.com', key: page.image, contentType: 'image/jpeg'};
    saveBuffer(buffer, uploadOptions, function (err, data) {
      if (!err) {
        console.log('>> Saved image:', data.Location);
      } else {
        console.error('>> Saved error:', page.url, err, _options.timeout, pages.length, 'togo...');
        retryPageCapture(pages, page, options);
        return;
      }

      mod.forEachWebShot(pages, options, done);
    });
  });
};
