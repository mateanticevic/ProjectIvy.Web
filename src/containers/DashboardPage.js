import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-bootstrap/lib';

import * as actions from '../actions/dashboardActions';
import Panel from '../components/common/Panel';
import OnlineGraph from '../components/dashboard/OnlineGraph';
import SpentByMonthGraph from '../components/dashboard/SpentByMonthGraph';

class DashboardPage extends React.Component {

  componentWillMount() {
    this.props.actions.getExpenseSumByMonth({});
    this.props.actions.getMovies({});
    this.props.actions.getOnineData({ from: "2017-11-01" });
  }

  render() {

    const dashboard = this.props.dashboard;

    const movies = dashboard.movies.map(function(movie){
      return <li className="list-group-item">{movie.title} ({movie.year})</li>;
    });

    return (
      <Grid>
        <Row>
          <Col lg={6}>
            <Panel header="Expenses">
              <SpentByMonthGraph data={dashboard.spentByMonthGraphData} />
            </Panel>
          </Col>
          <Col lg={6}>
            <Panel header="Online">
              <OnlineGraph data={dashboard.onlineGraphData} />
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <Panel header="Beer">
            </Panel>
          </Col>
          <Col lg={3}>
            <Panel header="Movies">
              <ul className="list-group">
                {movies}
              </ul>
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
