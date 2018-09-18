import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, Panel, ListGroup, ListGroupItem, Label, Checkbox } from 'react-bootstrap/lib';
import { Marker, Polyline } from "react-google-maps";
import FontAwesome from 'react-fontawesome';
import Moment from 'react-moment';
import moment from 'moment';
import _ from 'lodash';

import * as actions from '../actions/flightsActions';
import { Map, Select } from '../components/common';

class FlightsPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showFlights: false
        };

        props.actions.getFlights(props.flights.filters);
        props.actions.getFlightCountByAirport(props.flights.filters);

        this.filterYearChanged = this.filterYearChanged.bind(this);
        this.toggleShowFlights = this.toggleShowFlights.bind(this);
    }

    filterYearChanged(year) {
        const filters = {
            ...this.props.flights.filters,
            from: year ? moment().year(year).month(0).date(1).format("YYYY-MM-DD") : null,
            to: year ? moment().year(year).month(11).date(31).format("YYYY-MM-DD") : null
        };
        console.log(year);
        this.props.actions.filterChanged(filters);
    }

    toggleShowFlights(){
        this.setState({ ...this.state, showFlights: !this.state.showFlights});
    }

    render() {

        const state = this.props.flights;

        const flightsHeader = `Flights (${state.flights.count})`;

        const airports = state.countByAirport.map(airport => <Marker key={_.uniqueId('marker_airport_')} position={{ lat: airport.by.poi.location.latitude, lng: airport.by.poi.location.longitude }}
            title={airport.by.name} />);

        const flightPolylines = state.flights.items.map(flight => <Polyline options={{ strokeColor: '#305ea8', strokeOpacity: 0.4, strokeWeight: 4 }}
                                                                            path={[{lat: flight.origin.poi.location.latitude, lng: flight.origin.poi.location.longitude}, {lat: flight.destination.poi.location.latitude, lng: flight.destination.poi.location.longitude}]} />);

        const flights = state.flights.items.map(flight => <ListGroupItem key={_.uniqueId('list_item_flight_')} className="border-no-radius border-no-left border-no-right">
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
                                <Checkbox checked={this.state.showFlights} onChange={this.toggleShowFlights} className="margin-0">Show flights</Checkbox>
                            </Panel.Footer>
                        </Panel>
                    </Col>
                    <Col lg={3}>
                        <Row>
                            <Panel>
                                <Panel.Heading>Filters</Panel.Heading>
                                <Panel.Body>
                                    <Select options={state.years} onChange={this.filterYearChanged} />
                                </Panel.Body>
                            </Panel>
                        </Row>
                        <Row>
                            <Panel>
                                <Panel.Heading>{flightsHeader}</Panel.Heading>
                                <Panel.Body className="padding-0">
                                    <ListGroup>
                                        {flights}
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

FlightsPage.propTypes = {
    actions: PropTypes.object.isRequired,
    flights: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        flights: state.flights
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FlightsPage);