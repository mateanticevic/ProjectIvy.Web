import React from 'react';
import { Col, Grid, Row } from 'react-bootstrap/lib';

import * as formatHelper from '../utils/formatHelper';

const WidgetCard = (props) => {

    const formatted = formatHelper.number(props.value);
    let value = `${formatted.number}${formatted.exponent}`;

    if (props.unit) {
        value +=  ` ${props.unit}`;
    }

    return (
          <Grid>
              <Row>
                  <Col lg={12}>{props.title}</Col>
              </Row>
              <Row>
                  <Col lg={12}>
                    <h3 style={{ margin: '0px' }}>{value}</h3>
                  </Col>
              </Row>
          </Grid>
  );
};

export default WidgetCard;
