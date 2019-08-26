import React from 'react';
import { Grid, Col, Panel, ControlLabel, Row, Table, Button } from 'react-bootstrap/lib';
import { Polyline } from "react-google-maps";
import Datetime from 'react-datetime';
import moment from 'moment';
import { boundMethod } from 'autobind-decorator';
import * as _ from 'lodash';
import FontAwesome from 'react-fontawesome';

import { Map } from '../../components/common';
import * as trackingApi from '../../api/main/tracking';
import { Page } from '../Page';
import * as formatHelper from '../../utils/formatHelper';

class TrackingPage extends Page<{}, {}> {

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
        trackings: []
    };

    componentDidMount() {
    }

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
            trackingApi.getDistance(filters).then(distance => this.setState({ trackings: [...this.state.trackings, { day: day, trackings, id: _.uniqueId(), distance }] }))
        });
    }

    @boundMethod
    loadOnThisDay(){
        for(var year = 2014; year <= moment().year(); year++){
            this.loadDay(moment().year(year).format('YYYY-MM-DD'));
        }
    }

    @boundMethod
    onRemoveTracking(id) {
        this.setState({
            trackings: _.filter(this.state.trackings, t => t.id !== id)
        });
    }

    @boundMethod
    renderTrackingDays(trackings) {
        return trackings.map((tracking, i) => <tr>
            <td><span style={{ color: this.colors[i % this.colors.length] }}>■</span> {moment(tracking.day).format("DD.MM.YYYY.")}</td>
            <td title="From"><FontAwesome name="hourglass-start" />&nbsp;{moment(_.min(tracking.trackings.map(x => x.timestamp))).format('HH:mm')}</td>
            <td title="To"><FontAwesome name="hourglass-end" />&nbsp;{moment(_.max(tracking.trackings.map(x => x.timestamp))).format('HH:mm')}</td>
            <td title="Max speed"><FontAwesome name="tachometer" />&nbsp;{Math.round(_.max(tracking.trackings.map(x => x.speed)) * 3.6)} km/h</td>
            <td title="Distance"><FontAwesome name="road" />&nbsp;{formatHelper.number(tracking.distance).number} {formatHelper.number(tracking.distance).exponent}m</td>
            <td className="width-30"><FontAwesome name="times" className="show-on-hover" onClick={() => this.onRemoveTracking(tracking.id)} /></td>
        </tr>);
    }

    render() {
        const { filters, trackings } = this.state;

        return (
            <Grid>
                <Row>
                    <Col lg={3}>
                        <Panel>
                            <Panel.Heading>Filters</Panel.Heading>
                            <Panel.Body>
                                <ControlLabel>Day</ControlLabel>
                                <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} value={filters.day} onChange={x => this.onFiltersChanged({ day: x.format("YYYY-MM-DD") })} />
                                <Button onClick={this.loadOnThisDay}>On this day</Button>
                            </Panel.Body>
                        </Panel>
                    </Col>
                    <Col lg={9}>
                        <Panel>
                            <Panel.Heading>Map</Panel.Heading>
                            <Panel.Body className="padding-0 panel-medium">
                                <Map defaultZoom={12} defaultCenter={{ lat: 45.794441, lng: 15.928380 }}>
                                    {trackings.map((tracking, i) => <Polyline path={tracking.trackings} options={{ strokeColor: this.colors[i % this.colors.length] }} />)}
                                </Map>
                            </Panel.Body>
                        </Panel>
                        <Panel>
                            <Panel.Heading>Days</Panel.Heading>
                            <Panel.Body>
                                <Table>
                                    <tbody>
                                        {this.renderTrackingDays(trackings)}
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
