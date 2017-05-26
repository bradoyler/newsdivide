const fs = require('fs');
const Handlebars = require('handlebars');
const moment = require('moment-timezone');
// const debug = require('debug')('html')
const siteData = require('../lib/left-right.json');
const templateFile = fs.readFileSync('./lib/templates/dailydivide.hbs');
const persist = require('./persist');
const mod = module.exports = {};

mod.compile = function (debugFlag) {
  const template = Handlebars.compile(templateFile.toString());

  const data = {
    'date-slug': moment().tz('America/New_York').format('Y-MM-D'),
    'date-short': moment().tz('America/New_York').format('MMM DD, YYYY'),
    'yesterday-slug': moment().tz('America/New_York').subtract(1, 'days').format('Y-MM-D'),
    'yesterday-short': moment().tz('America/New_York').subtract(1, 'days').format('MMM DD, YYYY'),
    sites: JSON.stringify(siteData, null, ' ')
  };

  const html = template(data);
  const buffer = Buffer.from(html);
  const uploadOptions = {key: 'index.html', bucket: 'newsdivide.bradoyler.com', contentType: 'text/html'};

  if (debugFlag === true) {
    persist.saveBufferToFile(buffer, uploadOptions, function (err, data) {
      if (!err) {
        console.log('>> Saved html:', data);
      } else {
        console.error('>> Saved html Error:', err, uploadOptions);
        // retryGenerate();
      }
    });
  } else {
    persist.saveBufferToS3(buffer, uploadOptions, function (err, data) {
      if (!err) {
        console.log('>> Saved html:', data.Location);
      } else {
        console.error('>> Saved html Error:', err);
        // retryGenerate();
      }
    });
  }
};
