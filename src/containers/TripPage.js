import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, Panel } from 'react-bootstrap/lib';
import { Marker, Polyline } from "react-google-maps";

import * as actions from '../actions/tripActions';
import { Map, Widget } from '../components/common';
import { ExpensePanel } from '../components/expenses';

class TripPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      expenses: {
        page: 1,
        pageSize: 10
      }
    };

    props.actions.getTrip(props.params.id);
  }

  onExpensePageChange(page) {
    const expenses = { ...this.state.expenses, ...page };
    const state = { ...this.state, expenses: expenses };
    this.setState(state);
  }

  onUnlink(expenseId) {
    this.props.actions.deleteExpense(this.props.trip.trip.id, expenseId);
  }

  render() {

    const trip = this.props.trip.trip;

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
                  <Col lg={2} xs={6}>
                    <Widget title="Distance" value={trip.distance} unit="m" />
                  </Col>
                  <Col lg={2} xs={6}>
                    <Widget title="Spent" value={trip.totalSpent} unit="HRK" />
                  </Col>
                  <Col lg={2} xs={6}>
                    <Widget title="Cities" value={trip.cities.length} />
                  </Col>
                  <Col lg={2} xs={6}>
                    <Widget title="Countries" value={trip.countries.length} />
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
                  <Polyline path={this.props.trip.trackings} />
                </Map>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <ExpensePanel expenses={{ items: trip.expenses, count: trip.expenses.length }}
              page={this.state.expenses.page}
              pageSize={this.state.expenses.pageSize}
              onPageChange={page => this.onExpensePageChange(page)}
              onUnlink={expenseId => this.onUnlink(expenseId)} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

TripPage.propTypes = {
  actions: PropTypes.object.isRequired,
  trip: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    trip: state.trip
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TripPage);
