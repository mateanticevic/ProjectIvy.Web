import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Well from 'react-bootstrap/lib/Well';

const Widget = (props) => {

  return (
      <Well>
          <Grid>
              <Row>
                  <Col lg={12}>{props.title}</Col>
              </Row>
              <Row>
                  {props.value}
              </Row>
          </Grid>
      </Well>
  );
};

Widget.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default Widget;
