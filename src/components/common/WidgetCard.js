import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-bootstrap/lib';

import * as formatHelper from '../../utils/formatHelper';

const WidgetCard = (props) => {

    const formatted = formatHelper.number(props.value);
    const value = `${formatted.number}${formatted.exponent} ${props.unit}`;

  return (
          <Grid>
              <Row>
                  <Col lg={12}>{props.title}</Col>
              </Row>
              <Row>
                  <Col lg={12}>
                    <h3 style={{ margin: "0px" }}>{value}</h3>
                  </Col>
              </Row>
          </Grid>
  );
};

WidgetCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default WidgetCard;
