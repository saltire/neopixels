'use strict';

const serial = require('./serial');


const cmds = {
  off(duration) {
    return {
      mode: 'Fade',
      data: {
        Color: { r: 0, g: 0, b: 0 },
        'Duration (msec)': (duration || 0.25) * 1000,
      },
    };
  },

  hex(hex, duration) {
    if (!/^[\da-f]{6}$/i.test(hex)) {
      return null;
    }

    return {
      mode: 'Fade',
      data: {
        Color: {
          r: parseInt(hex.slice(0, 2), 16),
          g: parseInt(hex.slice(2, 4), 16),
          b: parseInt(hex.slice(4, 6), 16),
        },
        'Duration (msec)': (duration || 1) * 1000,
      },
    };
  },

  rainbow(duration) {
    return {
      mode: 'Rainbow',
      data: {
        'Duration (msec)': (duration || 5) * 1000,
        Length: 500,
      },
    };
  },
};

if (process.argv.length > 2) {
  const [, , cmd, ...args] = process.argv;

  if (!(cmd in cmds)) {
    console.log('Unknown command.');
    process.exit();
  }

  const params = cmds[cmd](...args);
  if (!params) {
    console.log('Invalid parameters.');
    process.exit();
  }

  const { mode, data } = params;

  serial.serial.on('open', () => serial.run(mode, data)
    .catch(console.error)
    .finally(() => process.exit()));
}
