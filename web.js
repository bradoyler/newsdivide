const webshot = require('webshot');
const sizeOf = require('image-size');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';

const defaults = {
  defaultWhiteBackground: true,
  errorIfStatusIsNot200: true,
  timeout: 65000,
  quality: 95,
  streamType: 'jpg',
  renderDelay: 2800,
  screenSize: { width: 375, height: 667 },
  userAgent: userAgent
};

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/webshot/:url', function (req, res) {
  const page = req.body;

  console.log('## Start webshot', page);
  const options = Object.assign({}, defaults, page.options);
  const renderStream = webshot(page.url, options);

  let buffers = [];
  renderStream.on('data', function (data) {
    // console.log('stream.data', data.length);
    buffers.push(data);
  });

  renderStream.on('error', function (err) {
    buffers = null;
    res.status(500).send({ error: `Capture error: ${page.url} ${err}` });
    console.error({ error: `Capture error: ${page.url} ${err}` });
  });

  renderStream.on('end', function (data) {
    if (!buffers) {
      res.status(500).send({ error: 'Error, no buffer' });
      console.error({ error: 'Error, no buffer' });
      return;
    }

    const buffer = Buffer.concat(buffers);
    let dimensions = null;
    try {
      dimensions = sizeOf(buffer);
    } catch (ex) {
      res.status(500).send({ error: `Error caught: ${page.url} ${ex}` });
      console.error({ error: `Error caught: ${page.url} ${ex}` });
      return;
    }

    if (!dimensions || dimensions.width < 300) {
      res.status(500).send({ error: 'insufficient dimensions' });
      console.error({ error: 'insufficient dimensions' });
      return;
    }

    res.type('jpeg');
    console.log('Done webshot', page, options, 'size:', buffer.length);
    res.send(buffer);
  });
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function (err) {
  if (err) {
    throw err;
  }

  console.log('Server started on port ' + app.get('port'));
});
