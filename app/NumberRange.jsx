import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';


export default function NumberRange({ label, min, max, value, updateValue }) {
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
            onChange={e => updateValue(e.target.value)}
          />
        </Col>
      </Row>
    </Grid>
  );
}
