import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, Pagination, Panel, ListGroup, ListGroupItem, Label } from 'react-bootstrap/lib';
import { Polygon, Marker } from "react-google-maps";
import FontAwesome from 'react-fontawesome';
import Moment from 'react-moment';

import * as actions from '../actions/flightsActions';
import { Map } from '../components/common';

class FlightsPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        props.actions.getFlights();
        props.actions.getFlightCountByAirport();
    }

    render() {

        const state = this.props.flights;

        const flightsHeader = `Flights (${state.flights.count})`;

        const airports = state.countByAirport.map(airport => <Marker defaultPosition={{ lat: airport.by.poi.location.latitude, lng: airport.by.poi.location.longitude }}
            title={airport.by.name}
            icon={{ scale: 40 }} />);

        const flights = state.flights.items.map(flight => <ListGroupItem className="border-no-radius border-no-left border-no-right">
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
                                </Map>
                            </Panel.Body>
                        </Panel>
                    </Col>
                    <Col lg={3}>
                        <Panel>
                            <Panel.Heading>{flightsHeader}</Panel.Heading>
                            <Panel.Body className="padding-0">
                                <ListGroup>
                                    {flights}
                                </ListGroup>
                            </Panel.Body>
                        </Panel>
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