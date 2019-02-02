'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');

const client = require('./client');
const modes = require('./modes');
const Serial = require('./serial');

const config = require('../config.json');


const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));

const serial = new Serial(config);


app.get('/modes', (req, res) => res.json({ modes: modes.getModes(config.pixelCount) }));

app.post('/color', (req, res, next) => {
  const { mode, data } = req.body;
  const bytes = modes.getBytes(mode, data);

  return serial.send(bytes)
    .then(() => res.sendStatus(200))
    .catch(next);
});

app.use(client);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).send(err.message);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}.`));
