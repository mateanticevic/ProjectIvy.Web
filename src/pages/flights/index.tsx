import _ from 'lodash';
import React from 'react';
import { Col, Container, Badge, ListGroup, ListGroupItem, Card, Row, Button, FormGroup, FormLabel, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { FaArrowRight, FaPlus } from 'react-icons/fa';
import { Marker, Polyline } from 'react-google-maps';
import moment from 'moment';
import AsyncSelect from 'react-select/async';

import api from 'api/main';
import { DateFormElement, Map } from 'components';
import { Page } from 'pages/page';
import FlightModal from './flight-modal';
import { FlightBinding } from 'types/flights';
import { airlineLoader, airportLoader } from 'utils/select-loaders';
import { RiTreasureMapLine } from 'react-icons/ri';

enum MapMode {
    Airports,
    Flights,
}

interface State {
    countByAirport: any,
    filters: any,
    flight: FlightBinding,
    flights: any,
    isModalOpen: boolean,
    mapMode: MapMode,
}

class FlightsPage extends Page<{}, State> {

    state: State = {
        countByAirport: [],
        filters: {
            page: 1,
            pageAll: true,
        },
        flight: {
        },
        flights: {
            count: 0,
            items: [],
        },
        isModalOpen: false,
        mapMode: MapMode.Airports,
    };

    componentDidMount() {
        this.onFiltersChange();
    }

    render() {
        const { countByAirport, filters, flights, isModalOpen, mapMode } = this.state;

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
                                <Map>
                                    {mapMode === MapMode.Airports &&
                                        countByAirport.map(airport =>
                                            <Marker
                                                key={_.uniqueId('marker_airport_')}
                                                label={{ text: airport.value.toString() }}
                                                position={{ lat: airport.key.poi.location.latitude, lng: airport.key.poi.location.longitude }}
                                            />
                                        )
                                    }
                                    {mapMode === MapMode.Flights &&
                                        flights.items.map(flight =>
                                            <Polyline
                                                key={_.uniqueId('polyline_flight_')}
                                                options={{ strokeColor: '#305ea8', strokeOpacity: 0.4, strokeWeight: 4 }}
                                                path={[{ lat: flight.origin.poi.location.latitude, lng: flight.origin.poi.location.longitude }, { lat: flight.destination.poi.location.latitude, lng: flight.destination.poi.location.longitude }]}
                                            />)
                                    }
                                </Map>
                            </Card.Body>
                            <Card.Footer>
                                <ToggleButtonGroup
                                    type="radio"
                                    size="sm"
                                    name="options"
                                    value={mapMode}
                                    onChange={mapMode => this.setState({ mapMode })}
                                >
                                    <ToggleButton id="mode-airports" value={MapMode.Airports}>Airports</ToggleButton>
                                    <ToggleButton id="mode-flights" value={MapMode.Flights}>Flights</ToggleButton>
                                </ToggleButtonGroup>
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
        api.flight.getCountByAirport(filters).then(countByAirport => this.setState({ countByAirport }));
    }
}

export default FlightsPage;
