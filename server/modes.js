'use strict';

module.exports = {
  getModes: pixelCount => [
    {
      label: 'Fade',
      data: [
        { id: 'color1', label: 'Color', type: 'color' },
        { id: 'duration', label: 'Duration (msec)', type: 'int16', min: 100, max: 10000, default: 1000 },
      ],
    },
    {
      label: 'Wipe',
      data: [
        { id: 'color1', label: 'Color', type: 'color' },
        { id: 'duration', label: 'Duration (msec)', type: 'int16', min: 100, max: 10000, default: 1000 },
      ],
    },
    {
      label: 'Marquee',
      data: [
        { id: 'color1', label: 'Color #1', type: 'color' },
        { id: 'color2', label: 'Color #2', type: 'color' },
        { id: 'length1', label: 'Color #1 Length', type: 'int16', min: 1, max: pixelCount, default: 5 },
        { id: 'length2', label: 'Color #2 Length', type: 'int16', min: 1, max: pixelCount, default: 2 },
        { id: 'duration', label: 'Duration (msec)', type: 'int16', min: 100, max: 10000, default: 1000 },
      ],
    },
    {
      label: 'Rainbow',
      data: [
        { id: 'duration', label: 'Duration (msec)', type: 'int16', min: 100, max: 60000, default: 5000 },
        { id: 'length', label: 'Length', type: 'int16', min: 1, max: 10000, default: 500 },
      ],
    },
    {
      label: 'Pulse',
      data: [
        { id: 'color1', label: 'Color #1', type: 'color' },
        { id: 'color2', label: 'Color #2', type: 'color' },
        { id: 'duration', label: 'Duration (msec)', type: 'int16', min: 100, max: 10000, default: 1000 },
      ],
    },
  ],

  getBytes(modeLabel, data) {
    const modes = module.exports.getModes();
    const mode = modes.find(m => m.label === modeLabel);

    return !mode ? [] :
      [modes.indexOf(mode)].concat(...((mode && mode.data) || [])
        .map(({ id, type }) => {
          if (type === 'color') {
            return [data[id].r, data[id].g, data[id].b];
          }
          if (type === 'int16') {
            return [data[id] >> 8, data[id] & 0xff];
          }
          return [];
        }));
  },
};
