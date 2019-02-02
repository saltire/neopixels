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
      currentMode: 'Fade',
      modeData: {
        Fade: {
          color1: new Color(),
          duration: 1000,
        },
        Wipe: {
          color1: new Color(),
          duration: 1000,
          reverse: false,
        },
        Marquee: {
          color1: new Color(),
          color2: new Color(),
          length1: 5,
          length2: 2,
          duration: 1000,
          reverse: false,
        },
        Rainbow: {
          duration: 5000,
          length: 500,
          reverse: false,
        },
        Pulse: {
          color1: new Color(),
          color2: new Color(),
          duration: 1000,
        },
      },
    };

    this.updateValue = this.updateValue.bind(this);
    this.send = this.send.bind(this);
  }

  updateValue(prop, value) {
    this.setState(({ currentMode, modeData }) => ({
      modeData: Object.assign({}, modeData, {
        [currentMode]: Object.assign({}, modeData[currentMode], { [prop]: value }),
      }),
    }));
  }

  send() {
    const { currentMode, modeData } = this.state;

    axios.post('/color', { mode: currentMode, data: modeData[currentMode] })
      .catch(console.error);
  }

  render() {
    const { pixelCount } = this.props;
    const { currentMode, modeData } = this.state;

    const count = Number(pixelCount) || 150;
    const data = modeData[currentMode];

    return (
      <div className='App'>
        <header>
          <h1>NeoPixel Controller</h1>
        </header>

        <nav>
          {Object.keys(modeData).map(mode => (
            <button
              key={mode}
              type='button'
              className={currentMode === mode ? 'active' : undefined}
              onClick={() => this.setState({ currentMode: mode })}
            >
              {mode}
            </button>
          ))}
        </nav>

        <main>
          {currentMode === 'Fade' && (
            <>
              <ColorSelect
                id='color1'
                label='Color'
                color={data.color1}
                updateValue={this.updateValue}
              />
              <NumberRange
                id='duration'
                label='Duration (msec)'
                min={100}
                max={10000}
                value={data.duration}
                updateValue={this.updateValue}
              />
            </>
          )}

          {currentMode === 'Wipe' && (
            <>
              <ColorSelect
                id='color1'
                label='Color'
                color={data.color1}
                updateValue={this.updateValue}
              />
              <NumberRange
                id='duration'
                label='Duration (msec)'
                min={100}
                max={10000}
                value={data.duration}
                updateValue={this.updateValue}
              />
            </>
          )}

          {currentMode === 'Marquee' && (
            <>
              <ColorSelect
                id='color1'
                label='Color #1'
                color={data.color1}
                updateValue={this.updateValue}
              />
              <NumberRange
                id='length1'
                label='Color #1 Length'
                min={1}
                max={count}
                value={data.length1}
                updateValue={this.updateValue}
              />
              <ColorSelect
                id='color2'
                label='Color #2'
                color={data.color2}
                updateValue={this.updateValue}
              />
              <NumberRange
                id='length2'
                label='Color #2 Length'
                min={1}
                max={count}
                value={data.length2}
                updateValue={this.updateValue}
              />
              <NumberRange
                id='duration'
                label='Duration (msec)'
                min={100}
                max={10000}
                value={data.duration}
                updateValue={this.updateValue}
              />
            </>
          )}

          {currentMode === 'Rainbow' && (
            <>
              <NumberRange
                id='duration'
                label='Duration (msec)'
                min={100}
                max={60000}
                value={data.duration}
                updateValue={this.updateValue}
              />
              <NumberRange
                id='length'
                label='Length (pixels)'
                min={1}
                max={600}
                value={data.length}
                updateValue={this.updateValue}
              />
            </>
          )}

          {currentMode === 'Pulse' && (
            <>
              <ColorSelect
                id='color1'
                label='Color #1'
                color={data.color1}
                updateValue={this.updateValue}
              />
              <ColorSelect
                id='color2'
                label='Color #2'
                color={data.color2}
                updateValue={this.updateValue}
              />
              <NumberRange
                id='duration'
                label='Duration (msec)'
                min={100}
                max={10000}
                value={data.duration}
                updateValue={this.updateValue}
              />
            </>
          )}
        </main>

        <nav>
          <button type='button' onClick={this.send}>Send</button>
        </nav>
      </div>
    );
  }
}

export default hot(module)(App);
