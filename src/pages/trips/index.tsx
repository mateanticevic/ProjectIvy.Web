import { boundMethod } from 'autobind-decorator';
import React from 'react';
import { Button, Col, FormLabel, FormGroup, Container, Card, Row, ProgressBar } from 'react-bootstrap';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';
import { FaPlus } from 'react-icons/fa';
import { Chart } from 'react-google-charts';

import api from '~api/main';
import { CountryListVisited, TripBinding, TripFilters } from 'types/trips';
import { DateFormElement, FlagIcon, Pagination } from '~components';
import TableWithSpinner from '~components/TableWithSpinner';
import { Page } from '../Page';
import TripModal from './TripModal';
import TripRow from './TripRow';

interface State {
    countries: [];
    countriesVisited: [];
    filters: TripFilters;
    isModalOpen: boolean;
    lists: CountryListVisited[];
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
        lists: [],
        trip: {
            cityIds: [],
        },
        trips: { count: 0, items: [] },
        tripIsBeingAdded: false,
        tripsAreLoading: true,
    };

    componentDidMount() {
        api.country
            .getAll()
            .then(countries => this.setState({ countries: countries.items }));
        this.onFiltersChanged();

        this.loadVisited();
    }

    render() {
        const { countries, countriesVisited, filters, lists, trips, tripIsBeingAdded } = this.state;

        const chartData = countriesVisited.map(x => [x.name]);

        return (
            <Container>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <Card.Header>Map</Card.Header>
                            <Card.Body className="panel-medium">
                                <Chart
                                    height="380px"
                                    chartType="GeoChart"
                                    data={chartData}
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
                                </Card>
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
    private loadVisited() {
        api.country
            .getListsVisited()
            .then(lists => this.setState({ lists }));
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
                this.loadVisited();
            });
    }
}

export default TripsPage;
