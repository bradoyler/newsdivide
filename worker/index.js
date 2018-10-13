const dotenv = require('dotenv')
dotenv.config({ silent: true })
const CronJob = require('cron').CronJob
const moment = require('moment-timezone')
const persist = require('../lib/persist')
const saveBufferToS3 = persist.saveBufferToS3
const queue = require('../lib/queue')
const html = require('../lib/generateHtml')
const manifest = require('../lib/data/manifest.json')
const htmlJob = require('./jobs/htmlJob')

const timeZone = 'America/New_York'
const autostart = true // convenient flag for testing
const cronJobs = []
const cronSchedules = [
  '1 2 1,5,6,7,8 * * *', // html updates
  '1 */15 9-18 * * *', // peak hours
  '1 2 20 * * *' // 8 pm update
]
const { defaults, apps, pages } = manifest
let dayFolder = moment().tz('America/New_York').format('Y-MM-D')

if (autostart) {
  console.log('auto-starting...')
  apps.forEach(app => {
    const dailyCopyParams = {
      Bucket: app.uploadParams.Bucket,
      Key: `day/${dayFolder}/${app.uploadParams.Key}`,
      CopySource: `${app.uploadParams.Bucket}/${app.uploadParams.Key}`,
      ACL: app.uploadParams.ACL
    }

    html.compile(app.jsonFilePath, app.templatePath)
      .then(html => saveBufferToS3(Buffer.from(html), app.uploadParams))
      .then(console.log)
      .then(() => persist.copyS3Object(app.uploadParams, dailyCopyParams))
      .then(console.log)
      .catch(console.error)
  })
  // run captures on startup
  queue(pages, defaults)
}

// start job for generating html
htmlJob.start()
console.log('>> create htmlJob cron:', htmlJob.cronTime.source)

// create each cronJob
cronSchedules.forEach((cronTime, idx) => {
  function onTick () {
    console.log(`>>> exec capture cron ${idx}:`, cronTime, new Date())
    queue(pages, defaults)
  }

  const cronJob = new CronJob({ cronTime, onTick, start: true, timeZone })
  console.log(`>> create capture cron ${idx}:`, cronTime)
  cronJobs.push(cronJob)
})
