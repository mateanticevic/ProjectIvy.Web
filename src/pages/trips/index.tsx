import { boundMethod } from 'autobind-decorator';
import _ from 'lodash';
import React from 'react';
import { Button, Col, FormLabel, FormGroup, Container, Panel, Row } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { Polygon } from 'react-google-maps';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';

import { TripBinding, TripFilters } from 'types/trips';
import api from '../../api/main';
import { FlagIcon, Map, Pagination } from '../../components';
import { DateFormElement } from '../../components';
import TableWithSpinner from '../../components/TableWithSpinner';
import * as trackingHelper from '../../utils/trackingHelper';
import { Page } from '../Page';
import TripModal from './TripModal';
import TripRow from './TripRow';

interface State {
  countries: [];
  countryBoundaries: any;
  countriesVisited: [];
  filters: TripFilters;
  isModalOpen: boolean;
  trip: TripBinding;
  trips: any;
  tripIsBeingAdded: boolean;
  tripsAreLoading: boolean;
}

class TripsPage extends Page<{}, State> {

  state: State = {
    countries: [],
    countriesVisited: [],
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
    tripIsBeingAdded: false,
    tripsAreLoading: true,
    countryBoundaries: [],
  };

  componentDidMount() {
    api.country
      .getAll()
      .then(countries => this.setState({ countries: countries.items }));
    this.loadVisitedCountries();
    this.onFiltersChanged();
  }

  render() {
    const countryPolygons = this.state.countryBoundaries.map(country => {
      return country.polygons.map(path => <Polygon key={_.uniqueId('polygon_country_')} path={trackingHelper.toGoogleMapsLocations(path)} onClick={this.onMapClick} />);
    });

    const polygons = [].concat(...countryPolygons);

    const { countries, countriesVisited, filters, trips, tripIsBeingAdded } = this.state;

    return (
      <Container>
        <Row>
          <Col lg={12}>
            <Card>
              <Card.Header>Map</Card.Header>
              <Card.Body className="padding-0 panel-large">
                <Map defaultCenter={{ lat: 50.666841, lng: 49.800719 }}>
                  {polygons}
                </Map>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <Card>
              <Card.Header>Filters</Card.Header>
              <Card.Body>
                <DateFormElement
                  label="From"
                  onChange={date => this.onFiltersChanged({ from: date })}
                  value={filters.from}
                />
                <DateFormElement
                  label="To"
                  onChange={date => this.onFiltersChanged({ to: date })}
                  value={filters.to}
                />
                <FormGroup>
                  <FormLabel>Country</FormLabel>
                  <ReactSelect
                    isMulti
                    options={countries.map(x => ({ value: x.id, label: x.name }))}
                    onChange={countries => this.onFiltersChanged({ countryId: countries ? countries.map(x => x.value) : [] })}
                    value={countries.filter(c => this.state.filters.countryId.filter(y => y === c.id).length > 0).map(x => ({ value: x.id, label: x.name }))}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>City</FormLabel>
                  <AsyncSelect
                    defaultOptions
                    isMulti
                    loadOptions={this.loadCities}
                    onChange={cities => this.onFiltersChanged({ cityId: cities ? cities.map(x => x.value) : [] })}
                  />
                </FormGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Row>
              <Col lg={12}>
                <Card>
                  <Card.Header>
                    <Row>
                      <Col xs={10}>Trips ({trips.count})</Col>
                      <Col xs={2}>
                        <Button
                          className="pull-right"
                          variant="primary"
                          size="xsmall"
                          onClick={() => this.setState({ isModalOpen: true })}>
                          <FontAwesome name="plus" /> New
                        </Button>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col lg={12}>
                        <TableWithSpinner isLoading={this.state.tripsAreLoading}>
                          {trips.items.map(trip => <TripRow key={trip.id} trip={trip} />)}
                        </TableWithSpinner>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <Pagination
                          page={filters.page}
                          pages={Math.ceil(trips.count / filters.pageSize)}
                          onPageChange={page => this.onFiltersChanged({ page })}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col lg={3}>
            <Card>
              <Card.Header>Countries ({countriesVisited.length})</Card.Header>
              <Card.Body className="panel-countries">
                {countriesVisited.map(country => <FlagIcon code={country.id} country={country.name} className="country-flag" />)}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <TripModal
          buttonIsLoading={tripIsBeingAdded}
          onClose={() => this.setState({ isModalOpen: false })}
          onChange={this.onTripChanged}
          onSave={this.onTripSave}
          loadCities={this.loadCities}
          isOpen={this.state.isModalOpen}
        />
      </Container>
    );
  }

  @boundMethod
  private loadCities(inputValue, callback) {
    api.city
      .get({ search: inputValue })
      .then(cities => callback(cities.items.map(city => ({ value: city.id, label: `${city.name}, ${city.country.name}` }))));
  }

  @boundMethod
  private loadVisitedCountries() {
    api.country
      .getVisitedBoundaries()
      .then(countries => this.setState({ countryBoundaries: countries }));
  }

  @boundMethod
  private onFiltersChanged(filterValue?) {
    const filters = this.resolveFilters(this.state.filters, filterValue);
    this.setState({
      filters,
      tripsAreLoading: true,
    });
    this.pushHistoryState(filters);

    api.trip
      .get(filters)
      .then(trips => this.setState({
        trips,
        tripsAreLoading: false,
      }));

    api.country
      .getVisited(filters)
      .then(countriesVisited => this.setState({ countriesVisited }));
  }

  @boundMethod
  private onTripChanged(changedValue: Partial<TripBinding>) {
    this.setState({
      trip: {
        ...this.state.trip,
        ...changedValue,
      },
    });
  }

  @boundMethod
  private onTripSave() {
    this.setState({ tripIsBeingAdded: true });
    api.trip
      .post(this.state.trip)
      .then(() => {
        this.setState({
          isModalOpen: false,
          tripIsBeingAdded: false,
        });
        this.onFiltersChanged();
        this.loadVisitedCountries();
      });
  }
}

export default TripsPage;
