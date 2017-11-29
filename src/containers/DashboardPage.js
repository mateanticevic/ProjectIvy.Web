import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap/lib';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import * as actions from '../actions/dashboardActions';
import Panel from '../components/common/Panel';

class DashboardPage extends React.Component {

  componentWillMount(){
    this.props.actions.getOnineData({ from: "2017-11-01" });
  }

  render() {

    const dashboard = this.props.dashboard;

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
                  <LineChart width={600} height={300} data={dashboard.onlineGraphData}
                          margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend />
                    <Line type="monotone" dataKey="seconds" stroke="#8884d8" />
                  </LineChart>
                </Panel>
              </Col>
          </Row>
      </Grid>
    );
  }
}

DashboardPage.propTypes = {
};

function mapStateToProps(state) {
  return {
    dashboard: state.dashboard
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
