import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, Label, OverlayTrigger, Tooltip } from 'react-bootstrap/lib';
import Moment from 'react-moment';
import { Marker } from "react-google-maps";

import * as actions from '../actions/dashboardActions';
import OnlineGraph from '../components/dashboard/OnlineGraph';
import { Map, Panel, Widget } from '../components/common';

class DashboardPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.dayOfWeek = this.dayOfWeek.bind(this);
  }

  componentWillMount() {
    this.props.actions.getLastLocation();
    this.props.actions.getExpenseSumByMonth({});
    this.props.actions.getConsumations({ pageSize: 5 });
    this.props.actions.getMovies({ pageSize: 5 });
    this.props.actions.getOnineData({ from: "2017-11-01" });
  }

  dayOfWeek(date){
    const fullDate = (
      <Tooltip id="tooltip">
        <Moment format="Do MMMM YYYY">{date}</Moment>
      </Tooltip>
    );

    return <OverlayTrigger placement="left" overlay={fullDate}><Label bsStyle="primary"><Moment format="ddd">{date}</Moment></Label></OverlayTrigger>;
  }

  render() {

    let that = this;

    const dashboard = this.props.dashboard;

    const movies = dashboard.movies.map(function (movie) {
      return <li className="list-group-item">{that.dayOfWeek(movie.timestamp)} {movie.title} ({movie.year})</li>;
    });

    const consumations = dashboard.consumations.map(function (consumation) {
      return <li className="list-group-item">{that.dayOfWeek(consumation.date)} {consumation.beer.name}</li>;
    });

    return (
      <Grid>
        <Row>
          <Col lg={6}>
            <Panel header="Location" containsMap>
              <Map defaultZoom={15} center={{ lat: dashboard.lastLocation.latitude, lng: dashboard.lastLocation.longitude}}>
                <Marker position={{ lat: dashboard.lastLocation.latitude, lng: dashboard.lastLocation.longitude}} title='Current location' />
              </Map>
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
              <ul className="list-group">
                {consumations}
              </ul>
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
