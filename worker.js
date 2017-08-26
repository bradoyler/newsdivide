const dotenv = require('dotenv');
dotenv.config({ silent: true });
const CronJob = require('cron').CronJob;
const moment = require('moment-timezone');
const persist = require('./lib/persist');
const saveBufferToS3 = persist.saveBufferToS3;
const queue = require('./lib/queue');
const html = require('./lib/generateHtml');
const manifest = require('./lib/data/manifest.json');
const cronScheduleA = '1 2 1,5,6,7,8 * * *';
const cronScheduleB = '1 */15 9-18 * * *';
const cronScheduleC = '1 2 20 * * *';
const defaults = manifest.defaults;
const apps = manifest.apps;
let dayFolder = moment().tz('America/New_York').format('Y-MM-D');

console.log('starting...');
apps.forEach((item) => {
  const dailyCopyParams = {
    Bucket: item.uploadParams.Bucket,
    Key: `day/${dayFolder}/${item.uploadParams.Key}`,
    CopySource: `${item.uploadParams.Bucket}/${item.uploadParams.Key}`,
    ACL: item.uploadParams.ACL
  };

  html.compile(item.jsonFilePath, item.templatePath)
  .then(html => saveBufferToS3(Buffer.from(html), item.uploadParams))
  .then(console.log)
  .then(() => persist.copyS3Object(item.uploadParams, dailyCopyParams))
  .then(console.log)
  .catch(console.error);
});

queue(manifest.pages, defaults);

const jobA = new CronJob(cronScheduleA, function () {
  console.log('>>> cron A:', cronScheduleA, new Date());
  dayFolder = moment().tz('America/New_York').format('Y-MM-D');
  queue(manifest.pages, defaults);

  // generate html file for each app
  apps.forEach((item) => {
    const dailyCopyParams = {
      Bucket: item.uploadParams.Bucket,
      Key: `day/${dayFolder}/${item.uploadParams.Key}`,
      CopySource: `${item.uploadParams.Bucket}/${item.uploadParams.Key}`,
      ACL: item.uploadParams.ACL
    };
    html.compile(item.jsonFilePath, item.templatePath)
    .then(html => saveBufferToS3(Buffer.from(html), item.uploadParams))
    .then(() => persist.copyS3Object(item.uploadParams, dailyCopyParams))
    .catch(console.error);
  });
}, null, true, 'America/New_York');

const jobB = new CronJob(cronScheduleB, function () {
  console.log('>>> cron B:', cronScheduleB, new Date());
  queue(manifest.pages, defaults);
}, null, true, 'America/New_York');

const jobC = new CronJob(cronScheduleC, function () {
  console.log('>>> cron C:', cronScheduleC, new Date());
  queue(manifest.pages, defaults);
}, null, true, 'America/New_York');

console.log('>> crons', jobA.cronTime.source, jobB.cronTime.source, jobC.cronTime.source);
