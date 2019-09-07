import React from 'react';
import { Grid, Row, Col, Panel, FormGroup, ControlLabel, Table } from 'react-bootstrap/lib';
import { Polygon } from "react-google-maps";
import _ from 'lodash';

import * as trackingHelper from '../../utils/trackingHelper';
import { Map, Pagination, Select } from '../../components/common';
import * as tripApi from '../../api/main/trip';
import * as countryApi from '../../api/main/country';
import { boundMethod } from 'autobind-decorator';
import TripRow from './TripRow';
import TripModal from './TripModal';
import { Page } from '../Page';
import TableWithSpinner from '../../components/common/TableWithSpinner';

type State = {
  countries: [],
  filters: any,
  isModalOpen: boolean,
  trips: any,
  tripsAreLoading: boolean,
  visitedCountries: any,
}

class TripsPage extends Page<{}, State> {

  state: State = {
    countries: [],
    filters: { pageSize: 10, page: 1 },
    isModalOpen: false,
    trips: { count: 0, items: [] },
    tripsAreLoading: true,
    visitedCountries: []
  }

  componentDidMount() {
    countryApi.getAll().then(countries => this.setState({ countries: countries.items }));
    countryApi.getVisitedBoundaries().then(countries => this.setState({ visitedCountries: countries }));
    this.onFiltersChanged();
  }

  @boundMethod
  onFiltersChanged(filterValue?) {
    let filters = this.resolveFilters(this.state.filters, filterValue);
    this.setState({
      filters,
      tripsAreLoading: true
    });
    this.pushHistoryState(filters);

    tripApi.get(filters).then(trips => this.setState({
      trips,
      tripsAreLoading: false
    }));
  }

  render() {
    const countryPolygons = this.state.visitedCountries.map(country => {
      return country.polygons.map(path => <Polygon key={_.uniqueId('polygon_country_')} path={trackingHelper.toGoogleMapsLocations(path)} onClick={this.onMapClick} />);
    });

    const polygons = [].concat(...countryPolygons);

    const tripsHeader = `Trips (${this.state.trips.count})`;

    const tripRows = this.state.trips.items.map(trip => {
      return <TripRow key={trip.id} trip={trip} />;
    });

    return (
      <Grid>
        <Row>
          <Col lg={12}>
            <Panel>
              <Panel.Heading>Map</Panel.Heading>
              <Panel.Body className="padding-0 panel-medium">
                <Map onClick={() => { }} defaultCenter={{ lat: 50.666841, lng: 49.800719 }}>
                  {polygons}
                </Map>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <Panel>
              <Panel.Heading>Filters</Panel.Heading>
              <Panel.Body>
                <FormGroup>
                  <ControlLabel>Country</ControlLabel>
                  <Select options={this.state.countries} onChange={countryId => this.onFiltersChanged({ countryId })} />
                </FormGroup>
              </Panel.Body>
            </Panel>
          </Col>
          <Col lg={9}>
            <Row>
              <Col lg={12}>
                <Panel header={tripsHeader}>
                  <Panel.Heading>{tripsHeader}</Panel.Heading>
                  <Panel.Body>
                    <Row>
                      <Col lg={12}>
                        <TableWithSpinner isLoading={this.state.tripsAreLoading}>
                          {tripRows}
                        </TableWithSpinner>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <Pagination page={this.state.filters.page}
                          pages={Math.ceil(this.state.trips.count / this.state.filters.pageSize)}
                          onPageChange={page => this.onFiltersChanged({ page })} />
                      </Col>
                    </Row>
                  </Panel.Body>
                </Panel>
              </Col>
            </Row>
          </Col>
        </Row>
        <TripModal onClose={() => this.setState({ isModalOpen: false })}
          isOpen={this.state.isModalOpen} />
      </Grid>
    );
  }
}

export default TripsPage;