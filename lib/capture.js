var webshot = require('webshot');
var mod = module.exports = {};
var persist = require('./persist');
//var saveStream = persist.saveStreamToFile;
var saveStream = persist.saveStreamToS3;


mod.forEachWebShot = function (urls, options) {
  var url = urls.shift();

  if (!url) {
    return;
  }

  console.log('>> Start webshot', url);

  var filename = url.replace(/^(http|https):\/\//, '')
      .replace(/\//g,'_') + '.jpg';

  if (url === 'http://idrudgereport.com') {
    options.shotOffset = { left: 0, right: 0, top: 280, bottom: 0 };
  } else {
    options.shotOffset = { left: 0, right: 0, top: 0, bottom: 0 };
  }

  var renderStream = webshot(url, options);

  saveStream(renderStream, filename, function (err, data) {
    if (!err) {
      console.log('>> Saved:', data.Location);
    } else {
      console.log('>> Capture Error:', url, err);
      urls.push(url); // add url back for retry
    }

    mod.forEachWebShot(urls, options);
  });
}
