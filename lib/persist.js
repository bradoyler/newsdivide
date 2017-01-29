var fs = require('fs');
var AWS = require('aws-sdk');
var dotenv = require('dotenv');
var moment = require('moment-timezone');
dotenv.config({silent: true});
//var CronJob = require('cron').CronJob
//var Readable = require('stream').Readable;
//var debug = require('debug')('test');
var mod = module.exports = {};

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET
 // region: 'us-west-2'
});

mod.saveStreamToFile = function saveStreamToFile (stream, options, callback) {
  //var filename = url.replace('http://','').replace(/\//g,'_') + '.jpg';
  var file = fs.createWriteStream('dist/' + options.key, {encoding: 'binary'});
  stream.on('data', function (data) {
    //console.log('writing >>>', data.length);
    file.write(data.toString('binary'), 'binary');
  });

  stream.on('end', function () {
    //console.log('stream.end >>>', filename);
    callback(null, options.key);
  });

  stream.on('error', function (err) {
    console.log('stream.error >>>', err, options.key);
    callback(err);
  });
};

mod.saveBufferToFile = function saveBufferToFile (buffer, options, callback) {
  fs.writeFile('dist/' + options.key, buffer, function (err, data) {
    callback(err, data);
  });
};

mod.saveBufferToS3 = function saveBufferToS3 (buffer, options, callback) {
  var bucket = options.bucket; //'newsdivide.bradoyler.com';
  var key = options.key;
  var hour = moment().tz('America/New_York').format('HH');
  var dayFolder = moment().tz('America/New_York').format('Y-MM-D');
  var keyValue = 'day/' + dayFolder + '/' + hour + '/' + key;
  var primaryKeyValue = 'day/' + dayFolder + '/' + key;

  var s3 = new AWS.S3({
    params: {
      Bucket: bucket,
      Key: keyValue, //'archive/2016-12-4/13/news.jpg',
      ContentType: options.contentType,
      ACL: 'public-read'
    }
  });

  //var readableStream = new Readable().wrap(stream);
  //console.log(key, '>>>>> upload');

  s3.upload({ Body: buffer }, function (err, data) {
    if (err) {
      return callback(err);
    }

    var copyParams = {
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

    var latestCopyParams = {
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
