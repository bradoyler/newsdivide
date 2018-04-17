/* eslint-disable no-unused-vars */
const dotenv = require('dotenv')
dotenv.config({silent: true})
const CronJob = require('cron').CronJob
const queue = require('../lib/queue')
const testManifest = require('../lib/data/test-manifest.json')
const debug = require('debug')('test')
const cronScheduleB = '1 34 9-18 * * *'

queue(testManifest.pages, testManifest.defaults)

const jobB = new CronJob(cronScheduleB, function () {
  debug('>>> cron', new Date())
  // capture.forEachWebShot(manifest.pages, options);
}, null, true, 'America/New_York')
