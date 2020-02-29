import { boundMethod } from 'autobind-decorator';
import * as _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Button, Col, Grid, Panel, Row, Table, ToggleButton, ToggleButtonGroup } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';
import FontAwesome from 'react-fontawesome';
import { Polyline, Marker } from 'react-google-maps';
import DrawingManager from 'react-google-maps/lib/components/drawing/DrawingManager';

import api from '../../api/main';
import { Map, RadioLabel } from '../../components';
import SimpleBarChart from '../../components/SimpleBarChart';
import SimpleLineChart from '../../components/SimpleLineChart';
import { GroupByTime } from '../../consts/groupings';
import { Page } from '../Page';
import MovementRow from './MovementRow';
import { Movement } from './types';

interface State {
    altitudeChartData?: any;
    datesInsideRectangle: string[];
    datesInsideRectangleChartData?: any;
    filters: any;
    groupDatesInsideRectangle: GroupByTime;
    lastTracking?: any;
    mapMode: MapMode;
    movements: Movement[];
    speedChartData?: any;
}

enum MapMode {
    Move = 'Move',
    Select = 'Select',
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

    state: State = {
        datesInsideRectangle: [],
        filters: {
        },
        groupDatesInsideRectangle: GroupByTime.ByYear,
        mapMode: MapMode.Move,
        movements: [],
    };

    render() {
        const { datesInsideRectangle, filters, movements } = this.state;

        const countGroupByOptions = [
            { value: GroupByTime.ByYear, name: 'Year' },
            { value: GroupByTime.ByMonthOfYear, name: 'Month of Year' },
            { value: GroupByTime.ByMonth, name: 'Month' },
            { value: GroupByTime.ByDayOfWeek, name: 'Day of Week' },
        ];

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
                                    {this.state.lastTracking &&
                                        <Marker
                                            position={{ lat: this.state.lastTracking.lat, lng: this.state.lastTracking.lng }}
                                            title={`Location at ${this.state.lastTracking.timestamp}`}
                                        />
                                    }
                                </Map>
                            </Panel.Body>
                            <Panel.Footer className="flex-container">
                                <ToggleButtonGroup type="radio" name="options" value={this.state.mapMode} onChange={mapMode => this.setState({ mapMode })}>
                                    <ToggleButton value={MapMode.Move}><FontAwesome name="arrows" /> Move</ToggleButton>
                                    <ToggleButton value={MapMode.Select}><FontAwesome name="square-o" /> Select</ToggleButton>
                                </ToggleButtonGroup>
                                <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} value={filters.day} onChange={date => this.onFiltersChanged({ day: date.format('YYYY-MM-DD') })} />
                                <Button onClick={this.loadOnThisDay}>On this day</Button>
                                <Datetime dateFormat="YYYY-MM-DD" timeFormat="HH:mm:ss" onChange={dateTime => this.onLastTrackingAtDate(dateTime.format('YYYY-MM-DD hh:mm'))} />
                            </Panel.Footer>
                        </Panel>
                        {movements.length > 0 &&
                            <Panel>
                                <Panel.Heading>Movements</Panel.Heading>
                                <Panel.Body>
                                    <Table>
                                        <tbody>
                                            {movements.map(movement => <MovementRow {...movement} onRemoveClick={this.removeTracking} onChartsClick={() => this.loadCharts(movement.id)} />)}
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
                                                    <td className="cursor-pointer" onClick={() => this.loadDay(date)}>{date}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                    <SimpleBarChart
                                        data={this.state.datesInsideRectangleChartData}
                                        name="year"
                                        value="count"
                                    />
                                </Panel.Body>
                                <Panel.Footer>
                                    <RadioLabel options={countGroupByOptions} onSelect={this.onGClick} />
                                </Panel.Footer>
                            </Panel>
                        }
                        {this.state.altitudeChartData &&
                            <Panel>
                                <Panel.Heading>
                                    Altitude
                                    <FontAwesome title="Close" name="times" className="pull-right cursor-pointer" onClick={() => this.setState({ altitudeChartData: null })} />
                                </Panel.Heading>
                                <Panel.Body>
                                    <SimpleLineChart
                                        data={this.state.altitudeChartData}
                                        name="time"
                                        unit=" m"
                                        value="altitude"
                                    />
                                </Panel.Body>
                            </Panel>
                        }
                        {this.state.speedChartData &&
                            <Panel>
                                <Panel.Heading>
                                    Speed
                                    <FontAwesome title="Close" name="times" className="pull-right cursor-pointer" onClick={() => this.setState({ speedChartData: null })} />
                                </Panel.Heading>
                                <Panel.Body>
                                    <SimpleLineChart
                                        data={this.state.speedChartData}
                                        name="time"
                                        unit=" km/h"
                                        value="speed"
                                    />
                                </Panel.Body>
                            </Panel>
                        }
                    </Col>
                </Row>
            </Grid >
        );
    }

    private loadCharts(movementId: string) {
        const trackings = this.state.movements.find(x => x.id === movementId)!.trackings;
        this.setState({
            altitudeChartData: trackings.map(tracking => ({ altitude: Math.ceil(tracking.altitude), time: moment(tracking.timestamp).format('HH:mm') })),
            speedChartData: trackings.map(tracking => ({ speed: Math.ceil(tracking.speed * 3.6), time: moment(tracking.timestamp).format('HH:mm') })),
        });
    }

    private loadDay(day: string) {
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
                const movements = [...this.state.movements, movement].sort((a, b) => new Date(b.day) - new Date(a.day));
                this.setState({ movements });
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
    public onFiltersChanged(filterValue?) {
        const filters = this.resolveFilters(this.state.filters, filterValue);

        if (!filters.day) {
            filters.day = moment().format('YYYY-MM-DD');
        }

        this.pushHistoryState(filters);
        this.setState({ filters });
        this.loadDay(filters.day);
    }

    @boundMethod
    private onG() {
        let countBy;

        switch (this.state.groupDatesInsideRectangle) {
            case GroupByTime.ByYear:
                countBy = _.countBy(this.state.datesInsideRectangle.map(date => moment(date).year()));
                break;
            case GroupByTime.ByMonthOfYear:
                countBy = _.countBy(_.reverse(this.state.datesInsideRectangle.map(date => moment(date).format('YYYY-MM'))));
                break;
            case GroupByTime.ByMonth:
                countBy = _.countBy(_.reverse(this.state.datesInsideRectangle.map(date => moment(date).format('MMMM'))));
                break;
            case GroupByTime.ByDayOfWeek:
                countBy = _.countBy(_.reverse(this.state.datesInsideRectangle.map(date => moment(date).format('dddd'))));
                break;
        }

        this.setState({ datesInsideRectangleChartData: Object.keys(countBy).map(key => ({ count: countBy[key], year: key })) });
    }

    @boundMethod
    private onGClick(groupDatesInsideRectangle: GroupByTime) {
        this.setState({ groupDatesInsideRectangle }, this.onG);
    }

    @boundMethod
    private onLastTrackingAtDate(dateTime: string) {
        api.tracking
            .getLast({ at: dateTime })
            .then(lastTracking => this.setState({ lastTracking }));
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
            .then(datesInsideRectangle => this.setState({ datesInsideRectangle }, this.onG));
    }

    @boundMethod
    private removeTracking(id: string) {
        this.setState({
            movements: _.filter(this.state.movements, t => t.id !== id),
        });
    }
}

export default TrackingPage;
