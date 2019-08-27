import React from 'react';
import { Grid, Col, Panel, ControlLabel, Row, Table, Button } from 'react-bootstrap/lib';
import { Polyline } from "react-google-maps";
import Datetime from 'react-datetime';
import moment from 'moment';
import { boundMethod } from 'autobind-decorator';
import * as _ from 'lodash';

import { Map } from '../../components/common';
import * as trackingApi from '../../api/main/tracking';
import { Page } from '../Page';
import MovementRow from './MovementRow';
import { Movement } from './types';

type State = {
    filters: any,
    movements: Movement[]
}

class TrackingPage extends Page<{}, State> {

    colors = [
        '#000000',
        '#ff0000',
        '#00a6ff',
        '#166e00',
        '#ff00f2',
        '#00fbff',
        '#ffff00',
    ];

    state = {
        filters: {
        },
        movements: []
    };

    @boundMethod
    onFiltersChanged(filterValue?) {
        const filters = this.resolveFilters(this.state.filters, filterValue);

        if (!filters.day)
            filters.day = moment().format('YYYY-MM-DD');

        this.pushHistoryState(filters);

        this.setState({ filters });
        this.loadDay(filters.day);
    }

    loadDay(day) {
        const nextDay = moment(day).add(1, 'days').format("YYYY-MM-DD");
        const filters = { from: day, to: nextDay };
        trackingApi.get(filters).then(trackings => {
            trackingApi.getDistance(filters).then(distance => {
                const movement : Movement = {
                    day: day, trackings,
                    id: _.uniqueId(),
                    distance,
                    color: this.colors[this.state.movements.length % this.colors.length]
                };
                this.setState({ movements: [...this.state.movements, movement] });
            })
        });
    }

    @boundMethod
    loadOnThisDay() {
        for (var year = 2014; year <= moment().year(); year++) {
            this.loadDay(moment().year(year).format('YYYY-MM-DD'));
        }
    }

    @boundMethod
    onRemoveTracking(id) {
        this.setState({
            movements: _.filter(this.state.movements, t => t.id !== id)
        });
    }

    render() {
        const { filters, movements } = this.state;

        return (
            <Grid>
                <Row>
                    <Col lg={3}>
                        <Panel>
                            <Panel.Heading>Filters</Panel.Heading>
                            <Panel.Body>
                                <ControlLabel>Day</ControlLabel>
                                <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} value={filters.day} onChange={date => this.onFiltersChanged({ day: date.format("YYYY-MM-DD") })} />
                                <Button onClick={this.loadOnThisDay}>On this day</Button>
                            </Panel.Body>
                        </Panel>
                    </Col>
                    <Col lg={9}>
                        <Panel>
                            <Panel.Heading>Map</Panel.Heading>
                            <Panel.Body className="padding-0 panel-medium">
                                <Map defaultZoom={12} defaultCenter={{ lat: 45.794441, lng: 15.928380 }}>
                                    {movements.map(movement => <Polyline path={movement.trackings} options={{ strokeColor: movement.color }} />)}
                                </Map>
                            </Panel.Body>
                        </Panel>
                        <Panel>
                            <Panel.Heading>Days</Panel.Heading>
                            <Panel.Body>
                                <Table>
                                    <tbody>
                                        {movements.map(movement => <MovementRow {...movement} onRemoveTracking={this.onRemoveTracking} />)}
                                    </tbody>
                                </Table>
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default TrackingPage;
