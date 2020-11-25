import { boundMethod } from 'autobind-decorator';
import _ from 'lodash';
import React from 'react';
import { FormCheck, Col, Container, Badge, ListGroup, ListGroupItem, Card, Row } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { Marker, Polyline } from 'react-google-maps';
import moment from 'moment';

import api from '../../api/main';
import { DateFormElement, Map } from '../../components';
import { Page } from '../Page';

interface State {

}

class FlightsPage extends Page<{}, State> {

    state = {
        countByAirport: [],
        filters: {
            page: 1,
            pageSize: 10,
        },
        flights: {
            count: 0,
            items: [],
        },
        showFlights: false,
    };

    componentDidMount() {
        this.onFiltersChange();
    }

    render() {
        const { filters, flights } = this.state;

        const airports = this.state.countByAirport.map(airport => <Marker key={_.uniqueId('marker_airport_')} position={{ lat: airport.by.poi.location.latitude, lng: airport.by.poi.location.longitude }}
            title={airport.by.name} />);

        const flightPolylines = flights.items.map(flight => <Polyline options={{ strokeColor: '#305ea8', strokeOpacity: 0.4, strokeWeight: 4 }}
            path={[{ lat: flight.origin.poi.location.latitude, lng: flight.origin.poi.location.longitude }, { lat: flight.destination.poi.location.latitude, lng: flight.destination.poi.location.longitude }]} />);

        const flightItems = flights.items.map(flight => <ListGroupItem key={_.uniqueId('list_item_flight_')} className="border-no-radius border-no-left border-no-right">
            <Badge variant="primary" title={flight.origin.name}>{flight.origin.iata}</Badge>&nbsp;
            <FontAwesome name="long-arrow-right" />&nbsp;
            <Badge variant="primary" title={flight.destination.name}>{flight.destination.iata}</Badge>
            <div className="pull-right" format="Do MMMM YYYY">{moment(flight.departure).format('Do MMMM YYYY')}</div>
        </ListGroupItem>);

        return (
            <Container>
                <Row>
                    <Col lg={9}>
                        <Card>
                            <Card.Header>Map</Card.Header>
                            <Card.Body className="padding-0 panel-large">
                                <Map onClick={this.onMapClick}>
                                    {airports}
                                    {this.state.showFlights && flightPolylines}
                                </Map>
                            </Card.Body>
                            <Card.Footer>
                                <FormCheck
                                    checked={this.state.showFlights}
                                    onChange={this.toggleShowFlights}
                                    className="margin-0"
                                    type="checkbox"
                                >
                                    Show flights
                                </FormCheck>
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
            </Container>
        );
    }

    @boundMethod
    private onFiltersChange(changedFilters?) {
        const filters = this.resolveFilters(this.state.filters, changedFilters);
        this.pushHistoryState(filters);

        this.setState({ filters });

        api.flight.getFlights(filters).then(flights => this.setState({ flights }));
    }

    @boundMethod
    private toggleShowFlights() {
        this.setState({ showFlights: !this.state.showFlights });
    }
}

export default FlightsPage;
