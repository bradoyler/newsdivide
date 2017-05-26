const fs = require('fs');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
const moment = require('moment-timezone');
dotenv.config({silent: true});
const debug = require('debug')('persist');
// var CronJob = require('cron').CronJob
// var Readable = require('stream').Readable;
const mod = module.exports = {};

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET
 // region: 'us-west-2'
});

mod.saveStreamToFile = function saveStreamToFile (stream, options, callback) {
  // var filename = url.replace('http://','').replace(/\//g,'_') + '.jpg';
  const file = fs.createWriteStream('dist/' + options.key, {encoding: 'binary'});
  stream.on('data', function (data) {
    debug('writing >>>', data.length);
    file.write(data.toString('binary'), 'binary');
  });

  stream.on('end', function () {
    // debug('stream.end >>>', filename);
    callback(null, options.key);
  });

  stream.on('error', function (err) {
    console.log('stream.error >>>', err, options.key);
    callback(err);
  });
};

mod.saveBufferToFile = function saveBufferToFile (buffer, options, callback) {
  fs.writeFile('dist/' + options.key, buffer, function (err, data) {
    callback(err, 'dist/' + options.key);
  });
};

mod.saveBufferToS3 = function saveBufferToS3 (buffer, options, callback) {
  const bucket = options.bucket; // 'newsdivide.bradoyler.com';
  const key = options.key;
  const hour = moment().tz('America/New_York').format('HH');
  const dayFolder = moment().tz('America/New_York').format('Y-MM-D');
  const keyValue = 'day/' + dayFolder + '/' + hour + '/' + key;
  const primaryKeyValue = 'day/' + dayFolder + '/' + key;

  const s3 = new AWS.S3({
    params: {
      Bucket: bucket,
      Key: keyValue, // 'archive/2016-12-4/13/news.jpg',
      ContentType: options.contentType,
      ACL: 'public-read'
    }
  });

  // var readableStream = new Readable().wrap(stream);
  // console.log(key, '>>>>> upload');

  s3.upload({ Body: buffer }, function (err, data) {
    if (err) {
      return callback(err);
    }

    const copyParams = {
      Bucket: bucket,
      Key: primaryKeyValue,
      CopySource: bucket + '/' + keyValue,
      ACL: 'public-read'
    };

    s3.copyObject(copyParams, function (err, data) {
      if (err) {
        console.log('ERR s3.copyObject', err);
      }
    });

    const latestCopyParams = {
      Bucket: bucket,
      Key: key,
      CopySource: bucket + '/' + keyValue,
      ACL: 'public-read'
    };

    s3.copyObject(latestCopyParams, function (err, data) {
      if (err) {
        console.log('ERR s3.copyObject', err);
      }
    });

    callback(null, data);
  });
};
