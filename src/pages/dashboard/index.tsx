import { boundMethod } from 'autobind-decorator';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Col, Container, Badge, ListGroup, ListGroupItem, OverlayTrigger, Card, Row, Tooltip } from 'react-bootstrap';
import { Marker } from 'react-google-maps';
import Moment from 'react-moment';

import api from '../../api/main';
import { Map, ValueLabel } from '../../components';
import ExpenseTypeLabel from '../../pages/expenses/ExpenseTypeLabel';
import OnlineGraph from './OnlineGraph';

class DashboardPage extends React.Component {

  state = {
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

  componentWillMount() {

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

  render() {
    const { carLogLatest, consumations, distance, expenses, location, movies, onlineGraphData, spent } = this.state;

    const expenseItems = expenses.map(expense => {
      return <ListGroupItem key={_.uniqueId('list_item_')}>
        {this.dayOfWeek(expense.date)} <ExpenseTypeLabel expenseType={expense.expenseType} /><span className="pull-right">{expense.amount} {expense.currency.symbol}</span>
      </ListGroupItem>;
    });

    const movieItems = movies.map(movie => {
      return <ListGroupItem key={_.uniqueId('list_item_')}>
        {this.dayOfWeek(movie.timestamp)} <a href={`http://www.imdb.com/title/${movie.imdbId}`} target="_blank">{movie.title} ({movie.year})</a>
        <span className="pull-right"><Badge variant="primary">{movie.myRating}</Badge></span>
      </ListGroupItem>;
    });

    const consumationItems = consumations.map(consumation => {
      const tooltip = <Tooltip id={_.uniqueId('tooltip_')}>{consumation.serving}</Tooltip>;

      return <ListGroupItem key={_.uniqueId('list_item_')}>
        {this.dayOfWeek(consumation.date)} {consumation.beer.name}
        <OverlayTrigger placement="top" overlay={tooltip}>
          <span className="pull-right"><Badge variant="primary">{consumation.volume / 1000}L</Badge></span>
        </OverlayTrigger>
      </ListGroupItem>;
    });

    return (
      <Container>
        <Row>
          <Col lg={6}>
            <Row>
              <Col lg={12}>
                <Card>
                  <Card.Header>Last location @ {this.dateTimeFormat(location.timestamp)}</Card.Header>
                  <Card.Body className="panel-medium padding-0">
                    <Map defaultZoom={15} defaultCenter={{ lat: location.lat, lng: location.lng }}>
                      <Marker position={{ lat: location.lat, lng: location.lng }} title="Current location" />
                    </Map>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Card>
                  <Card.Header>Online last 30 days</Card.Header>
                  <Card.Body className="panel-medium">
                    <OnlineGraph data={onlineGraphData} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col lg={6}>
            <Row>
              <Col lg={6}>
                <Card>
                  <Card.Header>Expenses</Card.Header>
                  <Card.Body className="panel-small padding-0">
                    <ListGroup>
                      {expenseItems}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6}>
                <Card>
                  <Card.Header>Spent</Card.Header>
                  <Card.Body className="panel-small padding-0">
                    <ValueLabel label="Today" unit="kn" value={spent.today} />
                    <ValueLabel label="This week" unit="kn" value={spent.week} />
                    <ValueLabel label={moment().format('MMMM')} unit="kn" value={spent.month} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Card>
                  <Card.Header>Beer</Card.Header>
                  <Card.Body className="panel-small padding-0">
                    <ListGroup>
                      {consumationItems}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6}>
                <Card>
                  <Card.Header>Movies</Card.Header>
                  <Card.Body className="panel-small padding-0">
                    <ListGroup>
                      {movieItems}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Card>
                  <Card.Header>Golf 7</Card.Header>
                  <Card.Body className="panel-small padding-0">
                    <h1 className="text-align-center">{carLogLatest.odometer} km</h1>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={6}>
                <Card>
                  <Card.Header>Distance</Card.Header>
                  <Card.Body className="panel-small padding-0">
                    <ValueLabel label="Today" unit="km" value={distance.today / 1000} />
                    <ValueLabel label="This week" unit="km" value={distance.week / 1000} />
                    <ValueLabel label={moment().format('MMMM')} unit="km" value={distance.month / 1000} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  @boundMethod
  private dateTimeFormat(dateTime) {
    return moment(dateTime).date() === moment().date() ? `Today ${moment(dateTime).format('H:mm')}` : moment(dateTime).format('MMMM Do H:mm');
  }

  private dayOfWeek(date) {
    const fullDate = (
      <Tooltip id="tooltip">
        <Moment format="Do MMMM YYYY">{date}</Moment>
      </Tooltip>
    );

    return <OverlayTrigger placement="top" overlay={fullDate}><Badge variant="primary"><Moment format="ddd">{date}</Moment></Badge></OverlayTrigger>;
  }
}

export default DashboardPage;
