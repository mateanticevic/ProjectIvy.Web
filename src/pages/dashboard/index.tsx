import { boundMethod } from 'autobind-decorator';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Col, Grid, Label, ListGroup, ListGroupItem, OverlayTrigger, Panel, Row, Tooltip } from 'react-bootstrap/lib';
import { Marker } from 'react-google-maps';
import Moment from 'react-moment';

import api from '../../api/main';
import { Map, ValueLabel } from '../../components';
import ExpenseTypeLabel from '../../pages/expenses/ExpenseTypeLabel';
import OnlineGraph from './OnlineGraph';

class DashboardPage extends React.Component {

  public state = {
    carLogLatest: { odometer: 0, timestamp: moment() },
    consumations: [],
    expenses: [],
    distance: {
      month: 0,
      today: 0,
      week: 0,
    },
    location: { lat: 0, lng: 0, timestamp: moment() },
    movies: [],
    onlineGraphData: [],
    spent: {
      month: 0,
      today: 0,
      week: 0,
    },
    spentByMonthGraphData: [],
  };

  public componentWillMount() {

    const lastFiveFilters = {
      pageSize: 5,
    };

    const todayFilters = {
      from: moment().format('YYYY-MM-DD'),
    };

    const weekFilters = {
      from: moment().isoWeekday(1).format('YYYY-MM-DD'),
    };

    const monthFilters = {
      from: moment().date(1).format('YYYY-MM-DD'),
    };

    api.consumation.get(lastFiveFilters).then(consumations => this.setState({ consumations: consumations.items }));
    api.movie.get(lastFiveFilters).then(movies => this.setState({ movies: movies.items }));
    api.tracking.getLast().then(location => this.setState({ location }));
    api.car.getLogLatest('golf-7').then(carLogLatest => this.setState({ carLogLatest }));
    api.web.getTimeTotalByDay(monthFilters).then(onlineGraphData => this.setState({ onlineGraphData }));

    api.expense.get(lastFiveFilters).then(expenses => this.setState({ expenses: expenses.items }));
    api.expense.getSum(todayFilters).then(today => this.setState({ spent: { ...this.state.spent, today } }));
    api.expense.getSum(weekFilters).then(week => this.setState({ spent: { ...this.state.spent, week } }));
    api.expense.getSum(monthFilters).then(month => this.setState({ spent: { ...this.state.spent, month } }));

    api.tracking.getDistance(todayFilters).then(today => this.setState({ distance: { ...this.state.distance, today } }));
    api.tracking.getDistance(weekFilters).then(week => this.setState({ distance: { ...this.state.distance, week } }));
    api.tracking.getDistance(monthFilters).then(month => this.setState({ distance: { ...this.state.distance, month } }));
  }

  public render() {
    const { carLogLatest, consumations, distance, expenses, location, movies, onlineGraphData, spent } = this.state;

    const expenseItems = expenses.map(expense => {
      return <ListGroupItem key={_.uniqueId('list_item_')}>
        {this.dayOfWeek(expense.date)} <ExpenseTypeLabel expenseType={expense.expenseType} /><span className="pull-right">{expense.amount} {expense.currency.symbol}</span>
      </ListGroupItem>;
    });

    const movieItems = movies.map(movie => {
      return <ListGroupItem key={_.uniqueId('list_item_')}>
        {this.dayOfWeek(movie.timestamp)} <a href={`http://www.imdb.com/title/${movie.imdbId}`} target="_blank">{movie.title} ({movie.year})</a>
        <span className="pull-right"><Label bsStyle="primary">{movie.myRating}</Label></span>
      </ListGroupItem>;
    });

    const consumationItems = consumations.map(consumation => {
      const tooltip = <Tooltip id={_.uniqueId('tooltip_')}>{consumation.serving}</Tooltip>;

      return <ListGroupItem key={_.uniqueId('list_item_')}>
        {this.dayOfWeek(consumation.date)} {consumation.beer.name}
        <OverlayTrigger placement="top" overlay={tooltip}>
          <span className="pull-right"><Label bsStyle="primary">{consumation.volume / 1000}L</Label></span>
        </OverlayTrigger>
      </ListGroupItem>;
    });

    return (
      <Grid>
        <Row>
          <Col lg={6}>
            <Row>
              <Col lg={12}>
                <Panel>
                  <Panel.Heading>Last location @ {this.dateTimeFormat(location.timestamp)}</Panel.Heading>
                  <Panel.Body className="panel-medium padding-0">
                    <Map defaultZoom={15} defaultCenter={{ lat: location.lat, lng: location.lng }}>
                      <Marker position={{ lat: location.lat, lng: location.lng }} title="Current location" />
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
                    <OnlineGraph data={onlineGraphData} />
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
                      {expenseItems}
                    </ListGroup>
                  </Panel.Body>
                </Panel>
              </Col>
              <Col lg={6}>
                <Panel>
                  <Panel.Heading>Spent</Panel.Heading>
                  <Panel.Body className="panel-small padding-0">
                    <ValueLabel label="Today" unit="kn" value={spent.today} />
                    <ValueLabel label="This week" unit="kn" value={spent.week} />
                    <ValueLabel label={moment().format('MMMM')} unit="kn" value={spent.month} />
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
                      {consumationItems}
                    </ListGroup>
                  </Panel.Body>
                </Panel>
              </Col>
              <Col lg={6}>
                <Panel>
                  <Panel.Heading>Movies</Panel.Heading>
                  <Panel.Body className="panel-small padding-0">
                    <ListGroup>
                      {movieItems}
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
                    <h1 className="text-align-center">{carLogLatest.odometer} km</h1>
                  </Panel.Body>
                </Panel>
              </Col>
              <Col lg={6}>
                <Panel>
                  <Panel.Heading>Distance</Panel.Heading>
                  <Panel.Body className="panel-small padding-0">
                    <ValueLabel label="Today" unit="km" value={distance.today / 1000} />
                    <ValueLabel label="This week" unit="km" value={distance.week / 1000} />
                    <ValueLabel label={moment().format('MMMM')} unit="km" value={distance.month / 1000} />
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
          </Col>
        </Row>
      </Grid>
    );
  }

  private dayOfWeek(date) {
    const fullDate = (
      <Tooltip id="tooltip">
        <Moment format="Do MMMM YYYY">{date}</Moment>
      </Tooltip>
    );

    return <OverlayTrigger placement="top" overlay={fullDate}><Label bsStyle="primary"><Moment format="ddd">{date}</Moment></Label></OverlayTrigger>;
  }

  @boundMethod
  private dateTimeFormat(dateTime) {
    return moment(dateTime).date() === moment().date() ? `Today ${moment(dateTime).format('H:mm')}` : moment(dateTime).format('MMMM Do H:mm');
  }
}

export default DashboardPage;
