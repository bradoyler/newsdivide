const fs = require('fs');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config({silent: true});

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET
 // region: 'us-west-2'
});

module.exports.saveBufferToFile = function (buffer, path, callback) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, buffer, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(path);
    });
  });
};

module.exports.copyS3Object = function (params, destParams) {
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
