import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

import Color from './color';


const channels = [
  { id: 'r', label: 'Red' },
  { id: 'g', label: 'Green' },
  { id: 'b', label: 'Blue' },
];

export default class ColorSelect extends Component {
  updateColor(channel, value) {
    const { id, color, updateValue } = this.props;

    const newColor = new Color(color.r, color.g, color.b);
    newColor[channel] = Number(value) || 0;

    updateValue(id, newColor);
  }

  render() {
    const { label, color } = this.props;

    return (
      <Grid fluid className='ColorSelect'>
        <Row><Col xs={12}><h2>{label}</h2></Col></Row>

        {channels.map(channel => (
          <Row key={channel.id}>
            <Col xs={2}>{channel.label}</Col>
            <Col xs={2}>{color[channel.id]}</Col>
            <Col xs={8}>
              <input
                type='range'
                min={0}
                max={255}
                value={color[channel.id]}
                onChange={e => this.updateColor(channel.id, e.target.value)}
              />
            </Col>
          </Row>
        ))}

        <Row><Col xs={12}><div className='color' style={{ background: color.hex() }} /></Col></Row>
      </Grid>
    );
  }
}
