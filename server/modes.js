'use strict';

module.exports = {
  getModes: pixelCount => [
    {
      label: 'Fade',
      data: [
        { label: 'Color', type: 'color' },
        { label: 'Duration (msec)', type: 'int16', min: 100, max: 10000, default: 1000 },
      ],
    },
    {
      label: 'Wipe',
      data: [
        { label: 'Color', type: 'color' },
        { label: 'Duration (msec)', type: 'int16', min: 100, max: 10000, default: 1000 },
      ],
    },
    {
      label: 'Marquee',
      data: [
        { label: 'Color #1', type: 'color' },
        { label: 'Color #2', type: 'color' },
        { label: 'Color #1 Length', type: 'int16', min: 1, max: pixelCount, default: 5 },
        { label: 'Color #2 Length', type: 'int16', min: 1, max: pixelCount, default: 2 },
        { label: 'Duration (msec)', type: 'int16', min: 100, max: 10000, default: 1000 },
      ],
    },
    {
      label: 'Rainbow',
      data: [
        { label: 'Duration (msec)', type: 'int16', min: 100, max: 60000, default: 5000 },
        { label: 'Length', type: 'int16', min: 1, max: 10000, default: 500 },
      ],
    },
    {
      label: 'Pulse',
      data: [
        { label: 'Color #1', type: 'color' },
        { label: 'Color #2', type: 'color' },
        { label: 'Duration (msec)', type: 'int16', min: 100, max: 10000, default: 1000 },
      ],
    },
  ],

  getBytes(modeLabel, data) {
    const modes = module.exports.getModes();
    const mode = modes.find(m => m.label === modeLabel);

    return !mode ? [] :
      [modes.indexOf(mode)].concat(...((mode && mode.data) || [])
        .map(({ label, type }) => {
          if (type === 'color') {
            return [data[label].r, data[label].g, data[label].b];
          }
          if (type === 'int16') {
            return [data[label] >> 8, data[label] & 0xff];
          }
          return [];
        }));
  },
};
