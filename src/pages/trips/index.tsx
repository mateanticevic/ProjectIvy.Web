import React from 'react';
import { Col, FormLabel, FormGroup, Container, Card, Row, ProgressBar, Button } from 'react-bootstrap';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';
import { Chart } from 'react-google-charts';
import _ from 'lodash';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';

import TripModal from './trip-modal';
import StayModal from './stay-modal';
import YearTrips from './year-trips';
import api from 'api/main';
import { CountryListVisited, TripFilters } from 'types/trips';
import { DateFormElement, DistributionCard, FlagIcon } from 'components';
import { Page } from '../page';
import { PagedList } from 'types/common';
import { cityLoader } from 'utils/select-loaders';
import { components } from 'types/ivy-types';

type Trip = components['schemas']['Trip'];
type TripBinding = components['schemas']['TripBinding'];
type StayBinding = components['schemas']['StayBinding'];
type Stay = components['schemas']['Stay'];

interface State {
    countries: [];
    countriesVisited: [];
    daysByYear: any;
    filters: TripFilters;
    isModalOpen: boolean;
    isStayModalOpen: boolean;
    lists: CountryListVisited[];
    trip: TripBinding;
    stay: Stay;
    trips: PagedList<Trip>;
    tripIsBeingAdded: boolean;
    stayIsBeingAdded: boolean;
    tripsAreLoading: boolean;
}

class TripsPage extends Page<unknown, State> {

    state: State = {
        countries: [],
        countriesVisited: [],
        daysByYear: [],
        filters: {
            pageSize: 10,
            page: 1,
            cityId: [],
            countryId: [],
        },
        isModalOpen: false,
        isStayModalOpen: false,
        lists: [],
        trip: {
            cityIds: [],
        },
        stay: {
            date: null,
            countryId: null,
            cityId: null,
        },
        trips: { count: 0, items: [] },
        tripIsBeingAdded: false,
        stayIsBeingAdded: false,
        tripsAreLoading: true,
    };

    componentDidMount() {
        api.country
            .getAll()
            .then(countries => this.setState({ countries: countries.items }));
        this.onFiltersChanged();

        api.trip.getDaysByYear()
            .then(daysByYear => this.setState({ daysByYear }));

        this.loadVisited();
    }

    render() {
        const { countries, countriesVisited, filters, lists, trips, tripIsBeingAdded, stayIsBeingAdded } = this.state;

        const chartData = countriesVisited.map(x => [x.name]);

        const tripsByYear = _.groupBy(trips.items, trip => {
            const date = moment(trip.timestampStart);
            return date > moment() ? 'Planned' : date.year();
        });
        const years = Object.keys(tripsByYear).sort().reverse();

        return (
            <Container>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <Card.Header>Map</Card.Header>
                            <Card.Body className="panel-medium">
                                <Chart
                                    height="360px"
                                    chartType="GeoChart"
                                    data={chartData}
                                    options={{ defaultColor: '#a5cefa' }}
                                />
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
                                        loadOptions={cityLoader}
                                        onChange={cities => this.onFiltersChanged({ cityId: cities ? cities.map(x => x.value) : [] })}
                                    />
                                </FormGroup>
                            </Card.Body>
                        </Card>
                        <div className="form-grid">
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={() => this.setState({ isModalOpen: true })}>
                                New
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => this.setState({ isStayModalOpen: true })}>
                                Add Stay
                            </Button>
                        </div>
                    </Col>
                    <Col lg={6}>
                        <Row>
                            <Col lg={12}>
                                {/*                                 <Card>
                                    <Card.Header>
                                        <Row>
                                            <Col xs={10}>Trips ({trips.count})</Col>
                                            <Col xs={2}>
                                                <Button
                                                    className="pull-right"
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => this.setState({ isModalOpen: true })}
                                                >
                                                    <FaPlus /> New
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
                                </Card> */}
                                <InfiniteScroll
                                    dataLength={trips.items.length}
                                    next={this.getNextPage}
                                    hasMore={filters.page * filters.pageSize < trips.count}
                                    loader={<h4>Loading...</h4>}
                                >
                                    {years.map(year =>
                                        <YearTrips
                                            key={year}
                                            year={year}
                                            trips={tripsByYear[year]}
                                        />
                                    )}
                                </InfiniteScroll>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Countries ({countriesVisited.length})</Card.Header>
                            <Card.Body>
                                <div className="panel-countries">
                                    {countriesVisited.map((country, index) => <FlagIcon
                                        code={country.id}
                                        country={country.name}
                                        className="country-flag"
                                        title={`#${index + 1} ${country.name}`}
                                    />)}
                                </div>
                                {lists.map(list =>
                                    <ProgressBar
                                        now={list.countriesVisited.length * 100 / (list.countriesVisited.length + list.countriesNotVisited.length)}
                                        label={`${list.name} (${list.countriesVisited.length}/${list.countriesVisited.length + list.countriesNotVisited.length})`}
                                    />
                                )}
                            </Card.Body>
                        </Card>
                        <DistributionCard
                            data={this.state.daysByYear}
                            name="Days"
                            unit=" days"
                        />
                    </Col>
                </Row>
                <TripModal
                    buttonIsLoading={tripIsBeingAdded}
                    onClose={() => this.setState({ isModalOpen: false })}
                    onChange={this.onTripChanged}
                    onSave={this.onTripSave}
                    isOpen={this.state.isModalOpen}
                />
                <StayModal
                    buttonIsLoading={stayIsBeingAdded}
                    onClose={() => this.setState({ isStayModalOpen: false })}
                    onChange={this.onStayChanged}
                    onSave={this.onStaySave}
                    isOpen={this.state.isStayModalOpen}
                    countries={countries}
                    stay={this.state.stay}
                />
            </Container>
        );
    }

    getNextPage = () => {
        this.onFiltersChanged({
            page: this.state.filters.page + 1,
        });
    };

    loadVisited = () => {
        api.country
            .getListsVisited()
            .then(lists => this.setState({ lists }));
    };

    onFiltersChanged = (filterValue?) => {
        const filters = this.resolveFilters(this.state.filters, filterValue);

        const state = { ...filters };
        delete state.page;
        delete state.pageSize;

        this.setState({
            filters,
            tripsAreLoading: true,
        });
        this.pushHistoryState(state);

        api.trip
            .get(filters)
            .then(trips => this.setState({
                trips: {
                    count: trips.count,
                    items: [...this.state.trips.items, ...trips.items],
                },
                tripsAreLoading: false,
            }));

        api.country
            .getVisited(filters)
            .then(countriesVisited => this.setState({ countriesVisited }));
    };

    onTripChanged = (changedValue: Partial<TripBinding>) => {
        this.setState({
            trip: {
                ...this.state.trip,
                ...changedValue,
            },
        });
    };

    onTripSave = () => {
        this.setState({ tripIsBeingAdded: true });
        api.trip
            .post(this.state.trip)
            .then(() => {
                this.setState({
                    isModalOpen: false,
                    tripIsBeingAdded: false,
                });
                this.onFiltersChanged();
                this.loadVisited();
            });
    };

    onStayChanged = (changedValue: Partial<StayBinding>) => {
        this.setState({
            stay: {
                ...this.state.stay,
                ...changedValue,
            },
        });
    };

    onStaySave = () => {
        this.setState({ stayIsBeingAdded: true });
        const { stay } = this.state;
        const stayBinding = {
            from: stay.from,
            to: stay.to,
            cityId: stay.city?.id,
            countryId: stay.city?.country?.id,
        };
        api.stay
            .post(stayBinding)
            .then(() => {
                this.setState({
                    isStayModalOpen: false,
                    stayIsBeingAdded: false,
                    stay: {
                        from: null,
                        to: null,
                        countryId: null,
                        cityId: null,
                    },
                });
                this.onFiltersChanged();
                this.loadVisited();
            });
    };
}

export default TripsPage;
