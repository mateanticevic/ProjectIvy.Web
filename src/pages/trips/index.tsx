import _ from 'lodash';
import React from 'react';
import { Button, Col, ControlLabel, FormGroup, Grid, Panel, Row, Table, InputGroup, Glyphicon } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';
import FontAwesome from 'react-fontawesome';
import { Polygon } from 'react-google-maps';
import AsyncSelect from 'react-select/async';
import ReactSelect from 'react-select';

import { boundMethod } from 'autobind-decorator';
import { TripBinding, TripFilters } from 'types/trips';
import api from '../../api/main';
import { Map, Pagination, Select } from '../../components';
import TableWithSpinner from '../../components/TableWithSpinner';
import * as trackingHelper from '../../utils/trackingHelper';
import { Page } from '../Page';
import TripModal from './TripModal';
import TripRow from './TripRow';

interface State {
  countries: [];
  filters: TripFilters;
  isModalOpen: boolean;
  trip: TripBinding;
  trips: any;
  tripsAreLoading: boolean;
  visitedCountries: any;
}

class TripsPage extends Page<{}, State> {

  public state: State = {
    countries: [],
    filters: {
      pageSize: 10,
      page: 1,
      cityId: [],
      countryId: [],
    },
    isModalOpen: false,
    trip: {
      cityIds: [],
    },
    trips: { count: 0, items: [] },
    tripsAreLoading: true,
    visitedCountries: [],
  };

  public componentDidMount() {
    api.country.getAll().then(countries => this.setState({ countries: countries.items }));
    this.loadVisitedCountries();
    this.onFiltersChanged();
  }

  @boundMethod
  public loadCities(inputValue, callback) {
    api.city.get({ search: inputValue }).then(cities => callback(cities.items.map((city) => ({ value: city.id, label: `${city.name}, ${city.country.name}` }))));
  }

  @boundMethod
  public loadVisitedCountries() {
    api.country.getVisitedBoundaries().then(countries => this.setState({ visitedCountries: countries }));
  }

  @boundMethod
  public onFiltersChanged(filterValue?) {
    console.log(filterValue);
    const filters = this.resolveFilters(this.state.filters, filterValue);
    this.setState({
      filters,
      tripsAreLoading: true,
    });
    this.pushHistoryState(filters);

    api.trip.get(filters).then((trips) => this.setState({
      trips,
      tripsAreLoading: false,
    }));
  }

  @boundMethod
  public onTripChanged(changedValue: Partial<TripBinding>) {
    this.setState({
      trip: { ...this.state.trip, ...changedValue },
    });
  }

  @boundMethod
  public onTripSave() {
    api.trip.post(this.state.trip)
      .then(() => {
        this.onFiltersChanged();
        this.loadVisitedCountries();
        this.setState({ isModalOpen: false });
      });
  }

  public render() {
    const countryPolygons = this.state.visitedCountries.map((country) => {
      return country.polygons.map((path) => <Polygon key={_.uniqueId('polygon_country_')} path={trackingHelper.toGoogleMapsLocations(path)} onClick={this.onMapClick} />);
    });

    const polygons = [].concat(...countryPolygons);

    const { countries, trips } = this.state;

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
                  <ControlLabel>From</ControlLabel>
                  <InputGroup>
                    <Datetime
                      dateFormat="YYYY-M-D"
                      timeFormat={false}
                      onChange={x => this.onFiltersChanged({ from: x.format('YYYY-M-D') })}
                      value={this.state.filters.from}
                    />
                    <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>To</ControlLabel>
                  <InputGroup>
                    <Datetime
                      dateFormat="YYYY-M-D"
                      timeFormat={false}
                      onChange={x => this.onFiltersChanged({ to: x.format('YYYY-M-D') })}
                      value={this.state.filters.to}
                    />
                    <InputGroup.Addon>
                      <Glyphicon glyph="calendar" />
                    </InputGroup.Addon>
                  </InputGroup>
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Country</ControlLabel>
                  <ReactSelect
                    isMulti
                    options={countries.map(x => ({ value: x.id, label: x.name }))}
                    onChange={countries => this.onFiltersChanged({ countryId: countries ? countries.map(x => x.value) : [] })}
                    value={countries.filter(c => this.state.filters.countryId.filter(y => y === c.id).length > 0).map(x => ({ value: x.id, label: x.name }))}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>City</ControlLabel>
                  <AsyncSelect
                    defaultOptions
                    isMulti
                    loadOptions={this.loadCities}
                    onChange={cities => this.onFiltersChanged({ cityId: cities ? cities.map(x => x.value) : [] })}
                  />
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
                          onPageChange={page => this.onFiltersChanged({ page })}
                        />
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
          isOpen={this.state.isModalOpen}
        />
      </Grid>
    );
  }
}

export default TripsPage;
