import { boundMethod } from 'autobind-decorator';
import * as _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Button, Col, Grid, Panel, Row, Table, ToggleButtonGroup, ToggleButton } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';
import FontAwesome from 'react-fontawesome';
import { Polyline } from 'react-google-maps';
import DrawingManager from 'react-google-maps/lib/components/drawing/DrawingManager';

import api from '../../api/main';
import { Map } from '../../components';
import { Page } from '../Page';
import MovementRow from './MovementRow';
import { Movement } from './types';
import SimpleLineChart from '../../components/SimpleLineChart';
import tracking from 'api/main/tracking';

interface State {
    altitudeChartData?: any;
    datesInsideRectangle: string[];
    filters: any;
    mapMode: MapMode;
    movements: Movement[];
    speedChartData?: any;
}

enum MapMode {
    Move = "Move",
    Select = "Select",
}

class TrackingPage extends Page<{}, State> {

    public colors = [
        '#000000',
        '#ff0000',
        '#00a6ff',
        '#166e00',
        '#ff00f2',
        '#00fbff',
        '#ffff00',
    ];

    public state = {
        datesInsideRectangle: [],
        filters: {
        },
        mapMode: MapMode.Move,
        movements: [],
    };

    @boundMethod
    public onFiltersChanged(filterValue?) {
        const filters = this.resolveFilters(this.state.filters, filterValue);

        if (!filters.day) {
            filters.day = moment().format('YYYY-MM-DD');
        }

        this.pushHistoryState(filters);
        this.setState({ filters });
        this.loadDay(filters.day);
    }

    public loadDay(day) {
        const nextDay = moment(day).add(1, 'days').format('YYYY-MM-DD');
        const filters = { from: day, to: nextDay };
        api.tracking.get(filters).then(trackings => {
            api.tracking.getDistance(filters).then(distance => {
                const movement: Movement = {
                    day,
                    trackings,
                    id: _.uniqueId(),
                    distance,
                    color: this.colors[this.state.movements.length % this.colors.length],
                };
                this.setState({
                    altitudeChartData: trackings.map(tracking => ({ hours: Math.ceil(tracking.altitude), day: moment(tracking.timestamp).format("HH:mm") })),
                    movements: [...this.state.movements, movement],
                    speedChartData: trackings.map(tracking => ({ hours: Math.ceil(tracking.speed * 3.6), day: moment(tracking.timestamp).format("HH:mm") }))
                });
            });
        });
    }

    @boundMethod
    private loadOnThisDay() {
        for (let year = 2014; year <= moment().year(); year++) {
            this.loadDay(moment().year(year).format('YYYY-MM-DD'));
        }
    }

    @boundMethod
    private onRemoveTracking(id) {
        this.setState({
            movements: _.filter(this.state.movements, (t) => t.id !== id),
        });
    }

    @boundMethod
    private onSelectComplete(rectangle: google.maps.Rectangle) {
        const filters = {
            topLeft: {
                lat: rectangle.getBounds().getNorthEast().lat(),
                lng: rectangle.getBounds().getSouthWest().lng(),
            },
            bottomRight: {
                lat: rectangle.getBounds().getSouthWest().lat(),
                lng: rectangle.getBounds().getNorthEast().lng(),
            },
        };

        rectangle.setMap(null);

        api.tracking
            .getDays(filters)
            .then(datesInsideRectangle => this.setState({ datesInsideRectangle }));
    }

    public render() {
        const { datesInsideRectangle, filters, movements } = this.state;

        return (
            <Grid>
                <Row>
                    <Col lg={12}>
                        <Panel>
                            <Panel.Heading>Map</Panel.Heading>
                            <Panel.Body className="padding-0 panel-large">
                                <Map defaultZoom={12} defaultCenter={{ lat: 45.798894, lng: 15.908531 }}>
                                    {movements.map(movement => <Polyline path={movement.trackings} options={{ strokeColor: movement.color }} />)}
                                    {this.state.mapMode === MapMode.Select &&
                                        <DrawingManager
                                            defaultDrawingMode={google.maps.drawing.OverlayType.RECTANGLE}
                                            onRectangleComplete={this.onSelectComplete}
                                        />
                                    }
                                </Map>
                            </Panel.Body>
                            <Panel.Footer className="flex-container">
                                <ToggleButtonGroup type="radio" name="options" value={this.state.mapMode} onChange={mapMode => this.setState({ mapMode })}>
                                    <ToggleButton value={MapMode.Move}><FontAwesome name="arrows" /> Move</ToggleButton>
                                    <ToggleButton value={MapMode.Select}><FontAwesome name="square-o" /> Select</ToggleButton>
                                </ToggleButtonGroup>
                                <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} value={filters.day} onChange={(date) => this.onFiltersChanged({ day: date.format('YYYY-MM-DD') })} />
                                <Button onClick={this.loadOnThisDay}>On this day</Button>
                            </Panel.Footer>
                        </Panel>
                        {movements.length > 0 &&
                            <Panel>
                                <Panel.Heading>Movements</Panel.Heading>
                                <Panel.Body>
                                    <Table>
                                        <tbody>
                                            {movements.map(movement => <MovementRow {...movement} onRemoveTracking={this.onRemoveTracking} />)}
                                        </tbody>
                                    </Table>
                                </Panel.Body>
                            </Panel>
                        }
                        {datesInsideRectangle.length > 0 &&
                            <Panel>
                                <Panel.Heading>Dates inside rectangle ({datesInsideRectangle.length})</Panel.Heading>
                                <Panel.Body>
                                    <Table>
                                        <tbody>
                                            {datesInsideRectangle.map(date =>
                                                <tr>
                                                    <td onClick={() => this.loadDay(date)}>{date}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </Panel.Body>
                            </Panel>
                        }
                        {this.state.altitudeChartData &&
                            <Panel>
                                <Panel.Heading>Altitude</Panel.Heading>
                                <Panel.Body>
                                    <SimpleLineChart data={this.state.altitudeChartData} unit=" m" />
                                </Panel.Body>
                            </Panel>
                        }
                        {this.state.speedChartData &&
                            <Panel>
                                <Panel.Heading>Speed</Panel.Heading>
                                <Panel.Body>
                                    <SimpleLineChart data={this.state.speedChartData} unit=" km/h" />
                                </Panel.Body>
                            </Panel>
                        }
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default TrackingPage;
