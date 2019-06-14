import Color from './color';


/* eslint-disable no-use-before-define */

export function getDefaultValues(attrs) {
  return attrs.reduce(
    (values, attr) => Object.assign(values, { [attr.label]: getDefaultValue(attr) }), {});
}

export function getDefaultValue({ type, children, default: defaultValue }) {
  if (type === 'color') {
    return new Color();
  }
  if (type === 'array') {
    return range(defaultValue || 1).map(() => getDefaultValues(children));
  }
  return defaultValue;
}

export function range(length) {
  return [...Array(parseInt(length)).keys()];
}
