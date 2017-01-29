const fs = require('fs');
const Handlebars = require('handlebars');
const moment = require('moment-timezone');
const siteData = require('../lib/left-right.json');
const templateFile = fs.readFileSync('./lib/templates/dailydivide.hbs');
const persist = require('./persist');
const mod = module.exports = {};

mod.compile = function (debugFlag) {
  var template = Handlebars.compile(templateFile.toString());

  var data = {
    'date-slug': moment().tz('America/New_York').format('Y-MM-D'),
    'date-short': moment().tz('America/New_York').format('MMM DD, YYYY'),
    'yesterday-slug': moment().tz('America/New_York').subtract(1, 'days').format('Y-MM-D'),
    'yesterday-short': moment().tz('America/New_York').subtract(1, 'days').format('MMM DD, YYYY'),
    sites: JSON.stringify(siteData, null, ' ')
  };

  var html = template(data);
  var buffer = new Buffer(html);
  var uploadOptions = { key: 'index.html', bucket: 'newsdivide.bradoyler.com', contentType: 'text/html'};

  if (debugFlag === true) {
    persist.saveBufferToFile(buffer, uploadOptions, function (err, data) {
      if (!err) {
        console.log('>> Saved:', data);
      } else {
        console.error('>> Save Error:', err, uploadOptions);
        // retryGenerate();
        return;
      }
    });
  } else {
    persist.saveBufferToS3(buffer, uploadOptions, function (err, data) {
      if (!err) {
        console.log('>> Saved:', data.Location);
      } else {
        console.error('>> Save Error:', err);
        // retryGenerate();
        return;
      }
    });
  }
};
