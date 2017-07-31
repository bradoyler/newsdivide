const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const moment = require('moment-timezone');
// const debug = require('debug')('html')
const siteData = require('../lib/left-right.json');
const nbcSiteData = require('../lib/nbcnews.json');
const templateFile = fs.readFileSync(path.join(__dirname, './templates/dailydivide.hbs'));
const templateFile2 = fs.readFileSync(path.join(__dirname, './templates/nbcnews.hbs'));
const persist = require('./persist');
const mod = module.exports = {};

function buildHtml (sites, templateFile) {
  const data = {
    'date-slug': moment().tz('America/New_York').format('Y-MM-D'),
    'date-short': moment().tz('America/New_York').format('MMM DD, YYYY'),
    'yesterday-slug': moment().tz('America/New_York').subtract(1, 'days').format('Y-MM-D'),
    'yesterday-short': moment().tz('America/New_York').subtract(1, 'days').format('MMM DD, YYYY'),
    sites: JSON.stringify(sites, null, ' ')
  };
  const template = Handlebars.compile(templateFile.toString());
  return template(data);
}

mod.compile = function (debugFlag) {
  const buffer = Buffer.from(buildHtml(siteData, templateFile));
  const buffer2 = Buffer.from(buildHtml(nbcSiteData, templateFile2));

  const uploadOptions = {Key: 'index.html', Bucket: 'newsdivide.bradoyler.com', ContentType: 'text/html', ACL: 'public-read'};
  const uploadOptions2 = {Key: 'nbcnews.html', Bucket: 'newsdivide.bradoyler.com', ContentType: 'text/html', ACL: 'public-read'};

  if (debugFlag === true) {
    persist.saveBufferToFile(buffer, uploadOptions, function (err, data) {
      if (!err) {
        console.log('>> Saved html:', data);
      } else {
        console.error('>> Saved html Error:', err, uploadOptions);
        // retryGenerate();
      }
    });

    persist.saveBufferToFile(buffer2, uploadOptions2, function (err, data) {
      if (!err) {
        console.log('>> Saved html:', data);
      } else {
        console.error('>> Saved html Error:', err, uploadOptions);
        // retryGenerate();
      }
    });
  } else {
    // SAVE HTML
    persist.saveBufferToS3(buffer, uploadOptions)
    .then(data => console.log('>>> Saved HTML to:', data.Location))
    .catch(err => {
      console.error('>> Saved html Error:', err);
      throw Error('saveBufferToS3: ' + err);
    });

    persist.saveBufferToS3(buffer2, uploadOptions2)
    .then(data => console.log('>>> Saved HTML to:', data.Location))
    .catch(err => {
      console.error('>> Saved html Error:', err);
      throw Error('saveBufferToS3: ' + err);
    });
  }
};
