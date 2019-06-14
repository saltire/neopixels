import React from 'react';

import ColorSelect from './ColorSelect';
import NumberRange from './NumberRange';
import { getDefaultValues, range } from './utils';


export default function Attribute({ attr, value, updateValue }) {
  const { label, type, min, max, children } = attr;
  return (
    <div className='Attribute'>
      {type === 'color' && (
        <ColorSelect
          label={label}
          color={value}
          updateValue={updateValue}
        />
      )}
      {type === 'int16' && (
        <NumberRange
          label={label}
          min={min}
          max={max}
          value={value}
          updateValue={updateValue}
        />
      )}
      {type === 'array' && (
        <>
          <NumberRange
            label={label}
            min={min}
            max={max}
            value={value.length}
            updateValue={newValue => updateValue(
              range(newValue).map(i => value[i] || getDefaultValues(children)))}
          />
          {range(value.length).map(i => (
            children.map(childAttr => (
              <Attribute
                key={childAttr.label}
                attr={childAttr}
                value={value[i][childAttr.label]}
                updateValue={newValue => updateValue(value.map((cv, ci) => (ci !== i ? cv :
                  Object.assign({}, cv, { [childAttr.label]: newValue }))))}
              />
            ))
          ))}
        </>
      )}
    </div>
  );
}
