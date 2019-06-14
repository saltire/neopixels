import React, { Component } from 'react';
import { hot } from 'react-hot-loader/root';
import axios from 'axios';

import './App.scss';
import Attribute from './Attribute';
import { getDefaultValues } from './utils';


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
            values[mode.label] = getDefaultValues(mode.data);
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
            {mode.data.map(attr => (
              <Attribute
                key={attr.label}
                attr={attr}
                value={values[mode.label][attr.label]}
                updateValue={newValue => this.updateValue(attr.label, newValue)}
              />
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

export default hot(App);
