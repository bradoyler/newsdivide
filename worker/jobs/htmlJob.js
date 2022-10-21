const CronJob = require('cron').CronJob
const moment = require('moment-timezone')
const html = require('../../lib/generateHtml')
const { saveBufferToS3, copyS3Object } = require('../../lib/persist')

const { apps } = require('../../config/manifest.json')
const cronTime = '1 2 1,5,6,7,8 * * *'
const timeZone = 'America/New_York'
let dayFolder = moment().tz('America/New_York').format('Y-MM-D')

function job () {
  console.log('>>> exec htmlJob cron:', cronTime, new Date())
  dayFolder = moment().tz('America/New_York').format('Y-MM-D')

  // generate html file for each app
  apps.forEach((item) => {
    const dailyCopyParams = {
      Bucket: item.uploadParams.Bucket,
      Key: `day/${dayFolder}/${item.uploadParams.Key}`,
      CopySource: `${item.uploadParams.Bucket}/${item.uploadParams.Key}`,
      ACL: item.uploadParams.ACL
    }
    html.compile(item.jsonFilePath, item.templatePath)
      .then(html => saveBufferToS3(Buffer.from(html), item.uploadParams))
      .then(() => copyS3Object(item.uploadParams, dailyCopyParams))
      .catch(console.error)
  })
}

const Job = new CronJob({
  cronTime,
  onTick: job,
  start: false,
  timeZone
})

module.exports = Job
