const webshot = require('webshot');
const sizeOf = require('image-size');

module.exports.page = function capturePage (page, options, done) {
  let _options = {};
  if (page.options) {
    _options = Object.assign({}, options, page.options);
  } else {
    _options = options;
  }

  return new Promise(function (resolve, reject) {
    console.log('## Start webshot', page.url);
    const renderStream = webshot(page.url, _options);

    let buffers = [];
    renderStream.on('data', function (data) {
      buffers.push(data);
    });

    renderStream.on('error', function (err) {
      buffers = null;
      const errMsg = `Capture error: ${page.url}, ${err}`;
      console.error(errMsg);
      return reject(errMsg);
    });

    renderStream.on('end', function (data) {
      if (!buffers) {
        return reject(Error('No buffers'));
      }

      const buffer = Buffer.concat(buffers);
      let dimensions = null;
      try {
        dimensions = sizeOf(buffer);
      } catch (ex) {
        const errMsg = `error caught: ${ex} ${page.url}`;
        console.error(errMsg);
        return reject(errMsg);
      }

      if (!dimensions || dimensions.width < 300) {
        return reject(Error('insufficient image dimensions'));
      }

      return resolve(buffer);
    });
  });
};
