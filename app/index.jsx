import React from 'react';
import { render } from 'react-dom';

import './index.scss';
import App from './App';
import { pixelCount } from '../config.json';


render(<App pixelCount={pixelCount} />, document.querySelector('#root'));
