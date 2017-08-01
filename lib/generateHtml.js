const fs = require('fs');
const Handlebars = require('handlebars');
const moment = require('moment-timezone');
const path = require('path');

function getFileString (filePath) {
  const content = fs.readFileSync(path.join(filePath));
  return content.toString();
}

function buildHtml (jsonFilePath, hbsFilePath) {
  const data = {
    'date-slug': moment().tz('America/New_York').format('Y-MM-D'),
    'date-short': moment().tz('America/New_York').format('MMM DD, YYYY'),
    'yesterday-slug': moment().tz('America/New_York').subtract(1, 'days').format('Y-MM-D'),
    'yesterday-short': moment().tz('America/New_York').subtract(1, 'days').format('MMM DD, YYYY'),
    sites: getFileString(jsonFilePath)
  };
  const template = Handlebars.compile(getFileString(hbsFilePath));
  return template(data);
}

module.exports.compile = function (jsonFilePath, hbsFilePath) {
  return new Promise((resolve) => {
    return resolve(buildHtml(jsonFilePath, hbsFilePath));
  });
};
