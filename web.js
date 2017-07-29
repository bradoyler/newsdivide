'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/webshot/:url', function (req, res) {
  const body = req.body.Body;
  res.json({
    msg: 'send this data',
    body
  });
});

app.listen(3000, function (err) {
  if (err) {
    throw err;
  }

  console.log('Server started on port 3000');
});
