const req = require('request');
const sites = require('../lib/manifest.json').pages;

// const sites = [
//   {
//     url: 'http://nbcnews.com',
//     test: '1'
//   },
//   {
//     url: 'http://xxxxnypost.com',
//     test: '2'
//   }
// ];

function post (url, options) {
  return new Promise((resolve) => {
    req.post({ url, form: options }, (err, resp, body) => {
      console.log(err, resp.statusCode, resp.statusMessage, body.length);
      if (resp.statusCode === 200) {
        return resolve(body);
      }
      resolve(err);
    });
  });
}

const imageResponses = sites.map(function (site) {
  const opts = site.options || {};
  opts.url = site.url;
  return post('https://webshot-api.herokuapp.com/webshot/' + site.image, opts);
});

Promise.all(imageResponses).then(values => {
  console.log('values:', values.length);
  const images = values.filter(val => val);
  console.log('images:', images.length);
});
