const dotenv = require('dotenv');
dotenv.config({silent: true});
const rp = require('request');
const persist = require('../lib/persist');
const saveBuffer = persist.saveBufferToS3;

const options = {
  method: 'POST',
  uri: 'https://webshot-api.herokuapp.com/webshot/test',
  encoding: null,
  resolveWithFullResponse: true
};

function uploadBuffer (res) {
  const buffer = Buffer.from(res.body, 'utf8');
  const uploadOptions = {bucket: 'newsdivide.bradoyler.com', key: 'tester2.jpg', contentType: 'image/jpeg'};
  saveBuffer(buffer, uploadOptions, function (err, data) {
    if (!err) {
      console.log('>> Saved image:', data.Location);
    } else {
      console.error('>> Saved error:', err);
    }
  });
}

// rp(options)
// .then(uploadBuffer)
// .catch(function (err) {
//   console.log('ERR:', err, '>>> ERROR');
// });

const sites = [
  {
    url: 'http://nypost.com',
    customCSS: '.dfp-ad {display: none}'
  },
  {
    url: 'http://www.nbcnews.com'
  }
];

const promises = sites.map(site => {
  const opts = Object.assign({}, { form: site }, options);
  return rp(opts)
    .then(result => ({result, success: true}))
    .catch(error => ({error, success: false}));
})


// .then(results => {
//   // const succeeded = results.filter(result => result.success).map(result => result.result);
//   // const failed = results.filter(result => !result.success).map(result => result.error);
//   return results;
// });
