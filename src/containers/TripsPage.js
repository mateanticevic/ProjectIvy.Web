import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, Pagination, Panel } from 'react-bootstrap/lib';
import { Polygon } from "react-google-maps";

import * as actions from '../actions/tripsActions';
import * as trackingHelper from '../utils/trackingHelper';
import { Map } from '../components/common';
import { TripModal, TripRow, TripTable } from '../components/trips';

class TripsPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.props.actions.getTrips(props.trips.filters);
    this.props.actions.getCountyVisitedBoundaries();

    this.onFiltersChanged = this.onFiltersChanged.bind(this);
  }

  onFiltersChanged(filterValue) {
    let filters = { ...this.props.trips.filters, ...filterValue };
    this.props.actions.changedFilters(filters);
  }

  onMapClick() {

  }

  render() {

    const countryPolygons = this.props.trips.countries.map(country => {
      return country.polygons.map(path => <Polygon path={trackingHelper.toGoogleMapsLocations(path)} onClick={this.onMapClick} />);
    });

    const polygons = [].concat(...countryPolygons);

    const trips = this.props.trips.trips;

    const tripsHeader = `Trips (${trips.count})`;

    const tripRows = this.props.trips.trips.items.map(function (trip) {
      return <TripRow key={trip.id} trip={trip} />;
    });

    return (
      <Grid>
        <Row>
          <Col lg={12}>
            <Panel>
              <Panel.Heading>Map</Panel.Heading>
              <Panel.Body className="padding-0 panel-medium">
                <Map onClick={this.onMapClick}>
                  {polygons}
                </Map>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
          </Col>
          <Col lg={9}>
            <Row>
              <Col lg={12}>
                <Panel header={tripsHeader}>
                  <Panel.Heading>{tripsHeader}</Panel.Heading>
                  <Panel.Body>
                    <Row>
                      <Col lg={12}>
                        <TripTable>
                          {tripRows}
                        </TripTable>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <Pagination prev next ellipsis boundaryLinks items={Math.ceil(this.props.trips.trips.count / this.props.trips.filters.pageSize)}
                          maxButtons={5}
                          activePage={this.props.trips.filters.page}
                          onSelect={page => this.onFiltersChanged({ page: page })} />
                      </Col>
                    </Row>
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
          </Col>
        </Row>
        <TripModal onClose={this.props.actions.closeModal}
          isOpen={this.props.trips.isModalOpen} />
      </Grid>
    );
  }
}

TripsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  trips: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    trips: state.trips
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TripsPage);