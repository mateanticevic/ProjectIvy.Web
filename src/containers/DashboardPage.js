import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, Label, OverlayTrigger, Tooltip } from 'react-bootstrap/lib';
import moment from 'moment';
import Moment from 'react-moment';
import { Marker } from "react-google-maps";

import * as actions from '../actions/dashboardActions';
import OnlineGraph from '../components/dashboard/OnlineGraph';
import ExpenseType from '../components/expenses/ExpenseType';
import { Map, Panel } from '../components/common';

class DashboardPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.dayOfWeek = this.dayOfWeek.bind(this);
    this.dateTimeFormat = this.dateTimeFormat.bind(this);
    this.dateFormat = this.dateFormat.bind(this);
  }

  componentWillMount() {
    this.props.actions.getCarLatestLog("punto");
    this.props.actions.getLastLocation();
    this.props.actions.getExpenses();
    this.props.actions.getConsumations({ pageSize: 5 });
    this.props.actions.getMovies({ pageSize: 5 });
    this.props.actions.getOnineData({ from: "2018-01-01" });
  }

  dayOfWeek(date) {
    const fullDate = (
      <Tooltip id="tooltip">
        <Moment format="Do MMMM YYYY">{date}</Moment>
      </Tooltip>
    );

    return <OverlayTrigger placement="top" overlay={fullDate}><Label bsStyle="primary"><Moment format="ddd">{date}</Moment></Label></OverlayTrigger>;
  }

  dateTimeFormat(dateTime) {
    return moment(dateTime).date() == moment().date() ? `Today ${moment(dateTime).format('H:mm')}` : moment(dateTime).format('MMMM Do H:mm');
  }

  dateFormat(dateTime) {
    return moment(dateTime).date() == moment().date() ? "Today" : moment(dateTime).format('MMMM Do');
  }

  render() {

    let that = this;

    const dashboard = this.props.dashboard;

    const expenses = dashboard.expenses.map(function (expense) {
      return <li className="list-group-item border-no-radius border-no-left border-no-right">
        {that.dayOfWeek(expense.date)} <ExpenseType expense={expense} /><span className="pull-right">{expense.amount} {expense.currency.symbol}</span>
      </li>;
    });

    const movies = dashboard.movies.map(function (movie) {
      return <li className="list-group-item border-no-radius border-no-left border-no-right">
        {that.dayOfWeek(movie.timestamp)} <span className="cell-no-overflow-100">{movie.title} ({movie.year})</span>
      </li>;
    });

    const consumations = dashboard.consumations.map(function (consumation) {

      const tooltip = <Tooltip>{consumation.serving}</Tooltip>;

      return <li className="list-group-item border-no-radius border-no-left border-no-right">
        {that.dayOfWeek(consumation.date)} {consumation.beer.name}
        <OverlayTrigger placement="top" overlay={tooltip}>
          <span className="pull-right"><Label bsStyle="primary">{consumation.volume / 1000}L</Label></span>
        </OverlayTrigger>
      </li>;
    });

    const locationHeader = `Last location @ ${that.dateTimeFormat(dashboard.lastLocation.timestamp)}`;

    const carLogHeader = `Odometer @ ${that.dateFormat(dashboard.carLogLatest.timestamp)}`;

    return (
      <Grid>
        <Row>
          <Col lg={6}>
            <Panel header={locationHeader} noPadding small>
              <Map defaultZoom={15} defaultCenter={{ lat: dashboard.lastLocation.lat, lng: dashboard.lastLocation.lng }}>
                <Marker position={{ lat: dashboard.lastLocation.lat, lng: dashboard.lastLocation.lng }} title='Current location' />
              </Map>
            </Panel>
          </Col>
          <Col lg={6}>
            <Panel header="Online" small>
              <OnlineGraph data={dashboard.onlineGraphData} />
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <Panel header="Expenses" noPadding tiny>
              <ul className="list-group">
                {expenses}
              </ul>
            </Panel>
          </Col>
          <Col lg={3}>
            <Panel header="Beer" noPadding tiny>
              <ul className="list-group">
                {consumations}
              </ul>
            </Panel>
          </Col>
          <Col lg={3}>
            <Panel header="Movies" noPadding tiny>
              <ul className="list-group">
                {movies}
              </ul>
            </Panel>
          </Col>
          <Col lg={3}>
            <Panel header={carLogHeader} noPadding tiny>
              <h1 className="text-align-center">{dashboard.carLogLatest.odometer} km</h1>
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
