const Pageres = require('pageres');
const getStream = require('get-stream');

const options = {delay: 2, format: 'jpg', scale: 1, crop: true, hide: 'iframe', css: 'nav { max-width: 100% }'};
// const sizes = ['375x667', '1080x1320'];
// const sizes = ['1086x1320'];

const pageres = new Pageres(options)
  .src('nbcnews.com/better', ['1680x2000'], {scale: 0.5})
  .src('nbcnews.com/mach', ['1680x2000'], {scale: 0.5})
  .src('nbcnews.com', ['840x1000'], {css: '.ad_wrapper{display:none} iframe{display:none !important}'})
  .dest('dist')
  .run()
  .then((streams) => {
    console.log('starting Pageres: ', streams.length);
    streams.forEach(function (stream) {
      getStream.buffer(stream, {maxBuffer: 999999}).then(buf => {
        console.log('buf', buf.length);
      })
      .catch(err => {
        console.error('getStream Error:', err);
      });
    });
  })
  .catch(err => {
    console.log('Pageres Error: ', err);
  });

console.log('pageres', pageres);
