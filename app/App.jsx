import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import axios from 'axios';

import './App.scss';
import Color from './color';
import ColorSelect from './ColorSelect';
import NumberRange from './NumberRange';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modes: null,
      currentMode: 'Fade',
      values: {},
    };

    this.updateValue = this.updateValue.bind(this);
    this.send = this.send.bind(this);
  }

  componentDidMount() {
    axios.get('/modes')
      .then((resp) => {
        if (resp.data.modes && resp.data.modes.length) {
          const values = {};
          resp.data.modes.forEach((mode) => {
            values[mode.label] = {};
            mode.data.forEach(({ type, label, default: defaultValue }) => {
              if (type === 'color') {
                values[mode.label][label] = new Color();
              }
              else if (type === 'int16') {
                values[mode.label][label] = defaultValue;
              }
            });
          });

          this.setState({
            modes: resp.data.modes,
            currentMode: resp.data.modes[0].label,
            values,
          });
        }
      })
      .catch(console.error);
  }

  updateValue(prop, value) {
    this.setState(({ currentMode, values }) => ({
      values: Object.assign({}, values, {
        [currentMode]: Object.assign({}, values[currentMode], { [prop]: value }),
      }),
    }));
  }

  send() {
    const { currentMode, values } = this.state;

    axios.post('/color', { mode: currentMode, data: values[currentMode] })
      .catch(console.error);
  }

  render() {
    const { modes, currentMode, values } = this.state;

    const mode = modes && modes.find(m => m.label === currentMode);

    return (
      <div className='App'>
        <header>
          <h1>NeoPixel Controller</h1>
        </header>

        {!modes && 'Loading...'}

        {modes && (
          <nav>
            {modes.map(({ label }) => (
              <button
                key={label}
                type='button'
                className={currentMode === label ? 'active' : undefined}
                onClick={() => this.setState({ currentMode: label })}
              >
                {label}
              </button>
            ))}
          </nav>
        )}

        {mode && (
          <main>
            {mode.data.map(({ label, type, min, max }) => (
              <>
                {type === 'color' && (
                  <ColorSelect
                    label={label}
                    color={values[mode.label][label]}
                    updateValue={this.updateValue}
                  />
                )}
                {type === 'int16' && (
                  <NumberRange
                    label={label}
                    min={min}
                    max={max}
                    value={values[mode.label][label]}
                    updateValue={this.updateValue}
                  />
                )}
              </>
            ))}
          </main>
        )}

        <nav>
          <button type='button' onClick={this.send}>Send</button>
        </nav>
      </div>
    );
  }
}

export default hot(module)(App);
