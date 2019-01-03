import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';


export default class NumberRange extends Component {
  render() {
    const { id, label, min, max, value, updateValue } = this.props;

    return (
      <Grid fluid className='NumberRange'>
        <Row>
          <Col xs={2}>{label}</Col>
          <Col xs={2}>{value}</Col>
          <Col xs={8}>
            <input 
              type='range' 
              min={min} 
              max={max} 
              value={value} 
              onChange={e => updateValue(id, e.target.value)} 
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}
