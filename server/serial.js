'use strict';

const SerialPort = require('serialport');
const util = require('util');

const modes = require('./modes');

const config = require('../config.json');


class Serial {
  constructor() {
    this.serial = new SerialPort(config.port, {
      baudRate: 9600,
      dtr: false,
    });

    this.serial
      .on('open', () => console.log('Connected to serial port', this.serial.path))
      .on('error', err => console.error('Error connecting to serial port:', err.message));

    this.write = util.promisify(this.serial.write.bind(this.serial));
  }

  send(bytes) {
    return this.write(bytes)
      .then(() => console.log(`Wrote ${bytes.length} bytes:`, bytes.join(' ')));
  }

  run(mode, data) {
    const bytes = modes.getBytes(mode, data);
    return this.send(bytes);
  }
}

module.exports = new Serial();
