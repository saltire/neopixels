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
        {
          label: 'Colors',
          type: 'group',
          min: 1,
          max: 100,
          default: 2,
          children: [
            { label: 'Color', type: 'color', repeat: 'Color count' },
            { label: 'Color Length', type: 'int16', min: 1, max: pixelCount, default: 5, repeat: 'Color count' },
          ],
        },
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
          const value = data[label];

          if (type === 'color') {
            return [value.r, value.g, value.b];
          }
          if (type === 'int16') {
            return [value >> 8, value & 0xff];
          }
          if (type === 'group') {
            return [value.count & 0xff].concat();
          }
          return [];
        }));
  },
};
