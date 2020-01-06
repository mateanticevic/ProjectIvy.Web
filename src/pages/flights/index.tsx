import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Checkbox, Col, Grid, Label, ListGroup, ListGroupItem, Panel, Row, InputGroup, Glyphicon, ControlLabel, FormGroup } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';
import { Marker, Polyline } from 'react-google-maps';
import Moment from 'react-moment';
import { boundMethod } from 'autobind-decorator';
import Datetime from 'react-datetime';

import api from '../../api/main';
import { Map, Select } from '../../components';

class FlightsPage extends React.Component {

    public state = {
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

    public componentDidMount() {
        this.onFiltersChange();
    }

    @boundMethod
    public onFiltersChange(changedFilters) {
        const filters = {
            ...this.state.filters,
            ...changedFilters,
        };
        api.flight.getFlights(filters).then((flights) => this.setState({ flights }));
    }

    @boundMethod
    public toggleShowFlights() {
        this.setState({ showFlights: !this.state.showFlights });
    }

    public render() {
        const { flights } = this.state;

        const flightsHeader = `Flights (${flights.count})`;

        const airports = this.state.countByAirport.map((airport) => <Marker key={_.uniqueId('marker_airport_')} position={{ lat: airport.by.poi.location.latitude, lng: airport.by.poi.location.longitude }}
            title={airport.by.name} />);

        const flightPolylines = flights.items.map((flight) => <Polyline options={{ strokeColor: '#305ea8', strokeOpacity: 0.4, strokeWeight: 4 }}
            path={[{ lat: flight.origin.poi.location.latitude, lng: flight.origin.poi.location.longitude }, { lat: flight.destination.poi.location.latitude, lng: flight.destination.poi.location.longitude }]} />);

        const flightItems = flights.items.map((flight) => <ListGroupItem key={_.uniqueId('list_item_flight_')} className="border-no-radius border-no-left border-no-right">
            <Label bsStyle="primary" title={flight.origin.name}>{flight.origin.iata}</Label>&nbsp;
            <FontAwesome name="long-arrow-right" />&nbsp;
            <Label bsStyle="primary" title={flight.destination.name}>{flight.destination.iata}</Label>
            <Moment className="pull-right" format="Do MMMM YYYY">{flight.departure}</Moment>
        </ListGroupItem>);

        return (
            <Grid>
                <Row>
                    <Col lg={9}>
                        <Panel>
                            <Panel.Heading>Map</Panel.Heading>
                            <Panel.Body className="padding-0 panel-large">
                                <Map onClick={this.onMapClick}>
                                    {airports}
                                    {this.state.showFlights && flightPolylines}
                                </Map>
                            </Panel.Body>
                            <Panel.Footer>
                                <Checkbox
                                    checked={this.state.showFlights}
                                    onChange={this.toggleShowFlights}
                                    className="margin-0"
                                >
                                    Show flights
                                </Checkbox>
                            </Panel.Footer>
                        </Panel>
                    </Col>
                    <Col lg={3}>
                        <Row>
                            <Panel>
                                <Panel.Heading>Filters</Panel.Heading>
                                <Panel.Body>
                                    <FormGroup>
                                        <ControlLabel>From</ControlLabel>
                                        <InputGroup>
                                            <Datetime
                                                dateFormat="YYYY-MM-DD"
                                                timeFormat={false}
                                                onChange={x => this.onFiltersChange({ from: x.format('YYYY-MM-DD') })}
                                            />
                                            <InputGroup.Addon>
                                                <Glyphicon glyph="calendar" />
                                            </InputGroup.Addon>
                                        </InputGroup>
                                    </FormGroup>
                                    <FormGroup>
                                        <ControlLabel>To</ControlLabel>
                                        <InputGroup>
                                            <Datetime
                                                dateFormat="YYYY-MM-DD"
                                                timeFormat={false}
                                                onChange={x => this.onFiltersChange({ to: x.format('YYYY-MM-DD') })}
                                            />
                                            <InputGroup.Addon>
                                                <Glyphicon glyph="calendar" />
                                            </InputGroup.Addon>
                                        </InputGroup>
                                    </FormGroup>

                                </Panel.Body>
                            </Panel>
                        </Row>
                        <Row>
                            <Panel>
                                <Panel.Heading>{flightsHeader}</Panel.Heading>
                                <Panel.Body className="padding-0">
                                    <ListGroup>
                                        {flightItems}
                                    </ListGroup>
                                </Panel.Body>
                            </Panel>
                        </Row>

                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default FlightsPage;
