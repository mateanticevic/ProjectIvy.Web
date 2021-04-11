import _ from 'lodash';
import React from 'react';
import { Col, Container, Badge, ListGroup, ListGroupItem, Card, Row, Button, Form, FormGroup, FormLabel } from 'react-bootstrap';
import { FaArrowRight, FaPlus } from 'react-icons/fa';
import { Marker, Polyline } from 'react-google-maps';
import moment from 'moment';
import AsyncSelect from 'react-select/async';


import api from '~api/main';
import { DateFormElement, Map } from '~components';
import { Page } from '~pages/Page';
import FlightModal from './flight-modal';
import { FlightBinding } from '~types/flights';
import { airlineLoader, airportLoader } from '~utils/select-loaders';


interface State {
    flight: FlightBinding,
    isModalOpen: boolean,
}

class FlightsPage extends Page<{}, State> {

    state = {
        countByAirport: [],
        filters: {
            page: 1,
            pageSize: 100,
        },
        flight: {
        },
        flights: {
            count: 0,
            items: [],
        },
        isModalOpen: false,
        showFlights: true,
    };

    componentDidMount() {
        this.onFiltersChange();
    }

    render() {
        const { filters, flights, isModalOpen } = this.state;

        const airports = this.state.countByAirport.map(airport => <Marker key={_.uniqueId('marker_airport_')} position={{ lat: airport.by.poi.location.latitude, lng: airport.by.poi.location.longitude }}
            title={airport.by.name} />);

        const flightPolylines = flights.items.map(flight => <Polyline options={{ strokeColor: '#305ea8', strokeOpacity: 0.4, strokeWeight: 4 }}
            path={[{ lat: flight.origin.poi.location.latitude, lng: flight.origin.poi.location.longitude }, { lat: flight.destination.poi.location.latitude, lng: flight.destination.poi.location.longitude }]} />);

        const flightItems = flights.items.map(flight => <ListGroupItem key={_.uniqueId('list_item_flight_')} className="border-no-radius border-no-left border-no-right">
            <Badge variant="primary" title={flight.origin.name}>{flight.origin.iata}</Badge>&nbsp;
            <FaArrowRight />&nbsp;
            <Badge variant="primary" title={flight.destination.name}>{flight.destination.iata}</Badge>
            <div className="pull-right" format="Do MMMM YYYY">{moment(flight.departure).format('Do MMMM YYYY')}</div>
        </ListGroupItem>);

        return (
            <Container>
                <Row>
                    <Col lg={9}>
                        <Card>
                            <Card.Header>
                                Map
                                <Button
                                    className="pull-right"
                                    variant="primary"
                                    size="sm"
                                    onClick={() => this.setState({ isModalOpen: true })}
                                >
                                    <FaPlus /> New
                                </Button>
                            </Card.Header>
                            <Card.Body className="padding-0 panel-large">
                                <Map onClick={this.onMapClick}>
                                    {airports}
                                    {this.state.showFlights && flightPolylines}
                                </Map>
                            </Card.Body>
                            <Card.Footer>
                                <Form.Check
                                    checked={this.state.showFlights}
                                    onChange={this.toggleShowFlights}
                                    className="margin-0"
                                    type="checkbox"
                                >
                                    Show flights
                                </Form.Check>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col lg={3}>
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <Card.Header>Filters</Card.Header>
                                    <Card.Body>
                                        <DateFormElement
                                            label="From"
                                            onChange={date => this.onFiltersChange({ from: date })}
                                            value={filters.from}
                                        />
                                        <DateFormElement
                                            label="To"
                                            onChange={date => this.onFiltersChange({ to: date })}
                                            value={filters.to}
                                        />
                                        <FormGroup>
                                            <FormLabel>Origin</FormLabel>
                                            <AsyncSelect
                                                defaultOptions
                                                loadOptions={airportLoader}
                                                onChange={x => this.onFiltersChange({ originId: x.value })}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <FormLabel>Destination</FormLabel>
                                            <AsyncSelect
                                                defaultOptions
                                                loadOptions={airportLoader}
                                                onChange={x => this.onFiltersChange({ destinationId: x.value })}
                                            />
                                        </FormGroup>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <Card.Header>Flights ({flights.count})</Card.Header>
                                    <Card.Body className="padding-0">
                                        <ListGroup>
                                            {flightItems}
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <FlightModal
                    isOpen={isModalOpen}
                    onChange={this.onFlightChange}
                    onClose={() => this.setState({ isModalOpen: false })}
                    onSave={this.onSaveFlight}
                />
            </Container>
        );
    }

    onFlightChange = (changed: Partial<FlightBinding>) => {
        this.setState({
            flight: {
                ...this.state.flight,
                ...changed,
            }
        });
    }

    onSaveFlight = () => {
        api.flight.post(this.state.flight)
            .then(() => {
                this.setState({ isModalOpen: false });
                this.onFiltersChange();
            });
    }


    onFiltersChange = (changedFilters?) => {
        const filters = this.resolveFilters(this.state.filters, changedFilters);
        this.pushHistoryState(filters);

        this.setState({ filters });

        api.flight.getFlights(filters).then(flights => this.setState({ flights }));
    }

    toggleShowFlights = () => {
        this.setState({ showFlights: !this.state.showFlights });
    }
}

export default FlightsPage;
