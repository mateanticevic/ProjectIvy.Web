import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, Label, OverlayTrigger, Tooltip, ListGroup, ListGroupItem, Panel } from 'react-bootstrap/lib';
import moment from 'moment';
import Moment from 'react-moment';
import { Marker } from "react-google-maps";
import _ from 'lodash';

import * as actions from '../actions/dashboardActions';
import OnlineGraph from '../components/dashboard/OnlineGraph';
import ExpenseType from '../components/expenses/ExpenseType';
import { Map, ValueLabel } from '../components/common';

class DashboardPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.dayOfWeek = this.dayOfWeek.bind(this);
    this.dateTimeFormat = this.dateTimeFormat.bind(this);
    this.dateFormat = this.dateFormat.bind(this);
  }

  componentWillMount() {
    this.props.actions.getCarLatestLog("golf-7");
    this.props.actions.getExpenseSumThisMonth();
    this.props.actions.getExpenseSumToday();
    this.props.actions.getExpenseSumThisWeek();
    this.props.actions.getLastLocation();
    this.props.actions.getExpenses();
    this.props.actions.getConsumations({ pageSize: 5 });
    this.props.actions.getMovies({ pageSize: 5 });
    this.props.actions.getOnineData();
    this.props.actions.getDistances();
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

    const carLogs = dashboard.carLogs.map(carLog => {
      return <ListGroupItem>
        {that.dayOfWeek(carLog.end)}
        &nbsp;{moment(carLog.start).diff(moment(carLog.end), 'minutes')}m
        <span className="pull-right"><Label bsStyle="primary">{(carLog.distance / 1000).toFixed(1)}km</Label></span>
      </ListGroupItem>;
    });

    const expenses = dashboard.expenses.map(expense => {
      return <ListGroupItem key={_.uniqueId('list_item_')}>
        {that.dayOfWeek(expense.date)} <ExpenseType expense={expense} /><span className="pull-right">{expense.amount} {expense.currency.symbol}</span>
      </ListGroupItem>;
    });

    const movies = dashboard.movies.map(movie => {
      return <ListGroupItem key={_.uniqueId('list_item_')}>
        {that.dayOfWeek(movie.timestamp)} <a href={`http://www.imdb.com/title/${movie.imdbId}`} target="_blank">{movie.title} ({movie.year})</a>
        <span className="pull-right"><Label bsStyle="primary">{movie.myRating}</Label></span>
      </ListGroupItem>;
    });

    const consumations = dashboard.consumations.map(consumation => {

      const tooltip = <Tooltip id={_.uniqueId('tooltip_')}>{consumation.serving}</Tooltip>;

      return <ListGroupItem key={_.uniqueId('list_item_')}>
        {that.dayOfWeek(consumation.date)} {consumation.beer.name}
        <OverlayTrigger placement="top" overlay={tooltip}>
          <span className="pull-right"><Label bsStyle="primary">{consumation.volume / 1000}L</Label></span>
        </OverlayTrigger>
      </ListGroupItem>;
    });

    const locationHeader = `Last location @ ${that.dateTimeFormat(dashboard.lastLocation.timestamp)}`;

    return (
      <Grid>
        <Row>
          <Col lg={6}>
            <Row>
              <Col lg={12}>
                <Panel>
                  <Panel.Heading>{locationHeader}</Panel.Heading>
                  <Panel.Body className="panel-medium padding-0">
                    <Map defaultZoom={15} defaultCenter={{ lat: dashboard.lastLocation.lat, lng: dashboard.lastLocation.lng }}>
                      <Marker position={{ lat: dashboard.lastLocation.lat, lng: dashboard.lastLocation.lng }} title='Current location' />
                    </Map>
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Panel>
                  <Panel.Heading>Online last 30 days</Panel.Heading>
                  <Panel.Body className="panel-medium">
                    <OnlineGraph data={dashboard.onlineGraphData} />
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
          </Col>
          <Col lg={6}>
            <Row>
              <Col lg={6}>
                <Panel>
                  <Panel.Heading>Expenses</Panel.Heading>
                  <Panel.Body className="panel-small padding-0">
                    <ListGroup>
                      {expenses}
                    </ListGroup>
                  </Panel.Body>
                </Panel>
              </Col>
              <Col lg={6}>
                <Panel>
                  <Panel.Heading>Spent</Panel.Heading>
                  <Panel.Body className="panel-small padding-0">
                    <ValueLabel label="Today" unit="kn" value={parseInt(dashboard.spentToday)} />
                    <ValueLabel label="This week" unit="kn" value={parseInt(dashboard.spentThisWeek)} />
                    <ValueLabel label={moment().format("MMMM")} unit="kn" value={parseInt(dashboard.spentThisMonth)} />
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Panel>
                  <Panel.Heading>Beer</Panel.Heading>
                  <Panel.Body className="panel-small padding-0">
                    <ListGroup>
                      {consumations}
                    </ListGroup>
                  </Panel.Body>
                </Panel>
              </Col>
              <Col lg={6}>
                <Panel>
                  <Panel.Heading>Movies</Panel.Heading>
                  <Panel.Body className="panel-small padding-0">
                    <ListGroup>
                      {movies}
                    </ListGroup>
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Panel>
                  <Panel.Heading>Golf 7</Panel.Heading>
                  <Panel.Body className="panel-small padding-0">
                    <h1 className="text-align-center">{dashboard.carLogLatest.odometer} km</h1>
                    <ListGroup>
                      {carLogs}
                    </ListGroup>
                  </Panel.Body>
                </Panel>
              </Col>
              <Col lg={6}>
                <Panel>
                  <Panel.Heading>Distance</Panel.Heading>
                  <Panel.Body className="panel-small padding-0">
                    <ValueLabel label="Today" unit="km" value={parseInt(dashboard.distance.today / 1000)} />
                    <ValueLabel label="This week" unit="km" value={parseInt(dashboard.distance.thisWeek / 1000)} />
                    <ValueLabel label={moment().format("MMMM")} unit="km" value={parseInt(dashboard.distance.thisMonth / 1000)} />
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
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
