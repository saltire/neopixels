'use strict';

module.exports = {
  getModes: pixelCount => [
    {
      label: 'Fade',
      attrs: [
        { label: 'Color', type: 'color' },
        { label: 'Duration (msec)', type: 'int16', min: 100, max: 10000, default: 1000 },
      ],
    },
    {
      label: 'Wipe',
      attrs: [
        { label: 'Color', type: 'color' },
        { label: 'Duration (msec)', type: 'int16', min: 100, max: 10000, default: 1000 },
      ],
    },
    {
      label: 'Marquee',
      attrs: [
        {
          label: 'Colors',
          type: 'array',
          min: 1,
          max: 100,
          default: 2,
          children: [
            { label: 'Color', type: 'color' },
            { label: 'Color Length', type: 'int16', min: 1, max: pixelCount, default: 5 },
          ],
        },
        { label: 'Duration (msec)', type: 'int16', min: 100, max: 10000, default: 1000 },
      ],
    },
    {
      label: 'Rainbow',
      attrs: [
        { label: 'Duration (msec)', type: 'int16', min: 100, max: 60000, default: 5000 },
        { label: 'Length', type: 'int16', min: 1, max: 10000, default: 500 },
      ],
    },
    {
      label: 'Pulse',
      attrs: [
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
      [modes.indexOf(mode)].concat(...((mode && mode.attrs) || [])
        .map(attr => this.getAttrBytes(attr, data[attr.label])));
  },

  getAttrBytes(attr, value) {
    const { type } = attr;

    if (type === 'color') {
      return [value.r, value.g, value.b];
    }
    if (type === 'int16') {
      return [value >> 8, value & 0xff];
    }
    if (type === 'array') {
      return [value.length & 0xff].concat();
    }
    return [];
  },
};
