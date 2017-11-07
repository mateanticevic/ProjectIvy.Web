import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap/lib';

import Panel from '../components/common/Panel';

class DashboardPage extends React.Component {

  render() {

    return (
      <Grid>
          <Row>
              <Col lg={12}>
                <h1>Today</h1>
              </Col>
          </Row>
          <Row>
              <Col lg={12}>
                <Panel header="Stats">
                </Panel>
              </Col>
          </Row>
      </Grid>
    );
  }
}

DashboardPage.propTypes = {
};

function mapStateToProps() {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
