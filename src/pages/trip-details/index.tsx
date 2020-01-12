import moment from 'moment';
import React from 'react';
import { Col, Grid, Panel, Row } from 'react-bootstrap/lib';
import { Marker, Polyline } from 'react-google-maps';
import { boundMethod } from 'autobind-decorator';

import { Trip } from 'types/trips';
import api from '../../api/main';
import { Map, ValueLabel } from '../../components';
import ExpensePanel from '../expenses/ExpensePanel';

interface State {
  beerSum: number;
  expenseFilters: any;
  trackings: any[];
  trip: Trip;
}

class TripDetailsPage extends React.Component<{}, State> {

  public state: State = {
    beerSum: 0,
    expenseFilters: {
      page: 1,
      pageSize: 10,
    },
    trip: {
      cities: [],
      countries: [],
      expenses: [],
      id: '',
    },
    trackings: [],
  };

  constructor(props) {
    super(props);

    api.trip.getById(props.match.params.id)
      .then((trip) => {
        this.setState({ trip });
        const filters = { from: trip.timestampStart, to: trip.timestampEnd };
        api.tracking.get(filters).then((trackings) => this.setState({ trackings }));
        api.consumation.getSum(filters).then((beerSum) => this.setState({ beerSum }));
      });
  }

  @boundMethod
  public onExpensePageChange(page) {
    this.setState({
      expenseFilters: {
        ...this.state.expenseFilters,
        page,
      },
    });
  }

  @boundMethod
  public onUnlink(expenseId) {
    api.trip
      .deleteExpense(this.state.trip.id, expenseId)
      .then(() => { });
  }

  public render() {
    const { beerSum, trackings, trip } = this.state;

    const days = moment(trip.timestampEnd).diff(moment(trip.timestampStart), 'days') + 1;

    const poiMarkers = trip.pois != null ? trip.pois.map(poi => <Marker key={poi.id} defaultPosition={{ lat: poi.latitude, lng: poi.longitude }} title={poi.name} />) : null;

    return (
      <Grid>
        <Row>
          <Col lg={12}>
            <h1>{trip.name}</h1>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Panel>
              <Panel.Heading>Stats</Panel.Heading>
              <Panel.Body>
                <Row>
                  <Col lg={2} md={3} sm={6} xs={12}>
                    <ValueLabel label="Days" value={days} />
                  </Col>
                  <Col lg={2} md={3} sm={6} xs={12}>
                    <ValueLabel label="Distance" unit="km" value={Number(trip.distance / 1000)} />
                  </Col>
                  <Col lg={2} md={3} sm={6} xs={12}>
                    <ValueLabel label="Spent" unit="kn" value={Number(trip.totalSpent)} />
                  </Col>
                  <Col lg={2} md={3} sm={6} xs={12}>
                    <ValueLabel label="Cities" value={trip.cities.length} />
                  </Col>
                  <Col lg={2} md={3} sm={6} xs={12}>
                    <ValueLabel label="Countries" value={trip.countries.length} />
                  </Col>
                  <Col lg={2} md={3} sm={6} xs={12}>
                    <ValueLabel label="Beer" unit="L" value={Math.ceil(beerSum / 1000)} />
                  </Col>
                </Row>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Panel>
              <Panel.Heading>Map</Panel.Heading>
              <Panel.Body className="padding-0 panel-medium">
                <Map>
                  {poiMarkers}
                  <Polyline path={trackings} />
                </Map>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ExpensePanel
              expenses={{ items: trip.expenses, count: trip.expenses.length }}
              page={this.state.expenseFilters.page}
              pageSize={this.state.expenseFilters.pageSize}
              onPageChange={this.onExpensePageChange}
              onUnlink={this.onUnlink} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default TripDetailsPage;
