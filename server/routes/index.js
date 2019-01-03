'use strict';

const express = require('express');

const app = require('./app');


const router = module.exports = express.Router();

router.post('/color', (req, res, next) => {
  console.log(req.body);
  res.sendStatus(200);
});

router.use(app);
