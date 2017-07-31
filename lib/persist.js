const fs = require('fs');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config({silent: true});
const debug = require('debug')('persist');
// var CronJob = require('cron').CronJob
// var Readable = require('stream').Readable;
// const mod = module.exports = {};

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET
 // region: 'us-west-2'
});

// AWS.config.setPromisesDependency(null);

module.exports.saveStreamToFile = function saveStreamToFile (stream, options, callback) {
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

module.exports.saveBufferToFile = function saveBufferToFile (buffer, options, callback) {
  fs.writeFile('dist/' + options.key, buffer, function (err, data) {
    callback(err, 'dist/' + options.key);
  });
};

module.exports.copyObject = function (params, destParams) {
  const s3 = new AWS.S3({ params });
  return new Promise((resolve, reject) => {
    s3.copyObject(destParams, function (err, data) {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

module.exports.saveBufferToS3 = function (buffer, params) {
  const s3 = new AWS.S3({ params });
  // return s3.upload({ Body: buffer }).promise(); // not yet supported in SDK
  return new Promise((resolve, reject) => {
    s3.upload({ Body: buffer }, (err, data) => {
      if (err) {
        console.log('err:', err, params);
        return reject(err);
      }
      return resolve(data);
    });
  });
};
