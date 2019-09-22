import React from 'react';
import { Grid, Row, Col, Panel, FormGroup, ControlLabel, Table, Button } from 'react-bootstrap/lib';
import { Polygon } from "react-google-maps";
import _ from 'lodash';
import FontAwesome from 'react-fontawesome';

import * as trackingHelper from '../../utils/trackingHelper';
import { Map, Pagination, Select } from '../../components';
import api from '../../api/main';
import { boundMethod } from 'autobind-decorator';
import TripRow from './TripRow';
import TripModal from './TripModal';
import { Page } from '../Page';
import TableWithSpinner from '../../components/TableWithSpinner';
import { TripBinding } from 'types/trips';

type State = {
  countries: [],
  filters: any,
  isModalOpen: boolean,
  trip: TripBinding,
  trips: any,
  tripsAreLoading: boolean,
  visitedCountries: any,
}

class TripsPage extends Page<{}, State> {

  state: State = {
    countries: [],
    filters: { pageSize: 10, page: 1 },
    isModalOpen: false,
    trip: {
      cityIds: []
    },
    trips: { count: 0, items: [] },
    tripsAreLoading: true,
    visitedCountries: []
  }

  componentDidMount() {
    api.country.getAll().then(countries => this.setState({ countries: countries.items }));
    this.loadVisitedCountries();
    this.onFiltersChanged();
  }

  @boundMethod
  loadCities(inputValue, callback) {
    api.city.get({ search: inputValue }).then(cities => callback(cities.items.map(city => { return { value: city.id, label: `${city.name}, ${city.country.name}` } })));
  }

  @boundMethod
  loadVisitedCountries() {
    api.country.getVisitedBoundaries().then(countries => this.setState({ visitedCountries: countries }));
  }

  @boundMethod
  onFiltersChanged(filterValue?) {
    let filters = this.resolveFilters(this.state.filters, filterValue);
    this.setState({
      filters,
      tripsAreLoading: true
    });
    this.pushHistoryState(filters);

    api.trip.get(filters).then(trips => this.setState({
      trips,
      tripsAreLoading: false
    }));
  }

  @boundMethod
  onTripChanged(changedValue: Partial<TripBinding>) {
    this.setState({
      trip: { ...this.state.trip, ...changedValue }
    });
  }

  @boundMethod
  onTripSave() {
    api.trip.post(this.state.trip)
      .then(() => {
        this.onFiltersChanged();
        this.loadVisitedCountries();
        this.setState({ isModalOpen: false });
      });
  }

  render() {
    const countryPolygons = this.state.visitedCountries.map(country => {
      return country.polygons.map(path => <Polygon key={_.uniqueId('polygon_country_')} path={trackingHelper.toGoogleMapsLocations(path)} onClick={this.onMapClick} />);
    });

    const polygons = [].concat(...countryPolygons);

    const { trips } = this.state;

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
                <Panel>
                  <Panel.Heading>
                    <Row>
                      <Col xs={10}>
                        {`Trips (${this.state.trips.count})`}
                      </Col>
                      <Col xs={2}>
                        <Button
                          className="pull-right"
                          bsStyle="primary"
                          bsSize="xsmall"
                          onClick={() => this.setState({ isModalOpen: true })}>
                          <FontAwesome name="plus" /> New
                        </Button>
                      </Col>
                    </Row>
                  </Panel.Heading>
                  <Panel.Body>
                    <Row>
                      <Col lg={12}>
                        <TableWithSpinner isLoading={this.state.tripsAreLoading}>
                          {trips.items.map(trip => <TripRow key={trip.id} trip={trip} />)}
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
        <TripModal
          onClose={() => this.setState({ isModalOpen: false })}
          onChange={this.onTripChanged}
          onSave={this.onTripSave}
          loadCities={this.loadCities}
          isOpen={this.state.isModalOpen} />
      </Grid>
    );
  }
}

export default TripsPage;