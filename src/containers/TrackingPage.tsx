import React from 'react';
import { connect } from 'react-redux';
import { Grid, Col, Panel, ControlLabel } from 'react-bootstrap/lib';
import { Polyline } from "react-google-maps";
import Datetime from 'react-datetime';
import moment from 'moment';

import { Map } from '../components/common';
import * as trackingApi from '../api/main/tracking';

class TrackingPage extends React.Component {

    constructor() {
        super();

        this.state = {
            filters: {
            },
            trackings: []
        }

        this.onFiltersChanged({ day: moment().format("YYYY-MM-DD") });

        this.onFiltersChanged = this.onFiltersChanged.bind(this);
    }

    onFiltersChanged(filter) {
        const filters = {...this.state.filters, ...filter};
        this.setState({ filters: filters });
        const nextDay = moment(filters.day).add(1, 'days').format("YYYY-MM-DD");
        trackingApi.get({ from: filters.day, to: nextDay }).then(trackings => this.setState({ trackings: trackings }));
    }

    render() {

        const filters = this.state;
        console.log(filters);

        return (
            <Grid>
                <Col lg={3}>
                    <Panel>
                        <Panel.Heading>Filters</Panel.Heading>
                        <Panel.Body>
                            <ControlLabel>Day</ControlLabel>
                            <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} value={filters.day} onChange={x => this.onFiltersChanged({ day: x.format("YYYY-MM-DD") })} />
                        </Panel.Body>
                    </Panel>
                </Col>
                <Col lg={9}>
                    <Panel>
                        <Panel.Heading>Map</Panel.Heading>
                        <Panel.Body className="padding-0 panel-medium">
                            <Map defaultZoom={12} defaultCenter={{ lat: 45.794441, lng: 15.928380 }}>
                                <Polyline path={this.state.trackings} />
                            </Map>
                        </Panel.Body>
                    </Panel>
                </Col>
            </Grid>
        );
    }
}

export default connect(function () { }, function () { })(TrackingPage);
