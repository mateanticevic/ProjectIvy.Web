import * as _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Button, Col, Container, Card, Row, Table, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import Datetime from 'react-datetime';
import FontAwesome from 'react-fontawesome';
import { Polyline, Marker, Rectangle } from 'react-google-maps';
import DrawingManager from 'react-google-maps/lib/components/drawing/DrawingManager';
import 'rc-slider/assets/index.css';
import geohash from 'ngeohash';
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';

import api from 'api/main';
import { Map, RadioLabel } from 'components';
import SimpleBarChart from 'components/simple-bar-chart';
import { SimpleLineChart } from 'components';
import { GroupByTime } from 'consts/groupings';
import { Page } from 'pages/page';
import MovementRow from './movement-row';
import { Movement } from './types';
import SelectedMovement from './selected-movement';
import CalendarGrid from './calendar-grid';

interface State {
    altitudeChartData?: any;
    datesInsideRectangle: string[];
    datesInsideRectangleChartData?: any;
    filters: any;
    geohashRectangles: any;
    groupDatesInsideRectangle: GroupByTime;
    heatMapData?: any;
    mapMode: MapMode;
    movements: Movement[];
    movement?: Movement;
    selectedMovementOffset: number;
    selectedTracking?: any;
    speedChartData?: any;
}

enum MapMode {
    Move = 'Move',
    DaysInRectanlge = 'Select',
    HeatmapInRectangle = 'HeatmapInRectangle',
    TrackingsInRectangle = 'TrackingsInRectangle',
    Geohash = 'Geohash'
}

class TrackingPage extends Page<unknown, State> {
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
        geohashRectangles: [],
        groupDatesInsideRectangle: GroupByTime.ByYear,
        mapMode: MapMode.Move,
        movements: [],
        selectedMovementOffset: 0,
    };

    map;

    render() {
        const { datesInsideRectangle, filters, mapMode, movements, movement } = this.state;

        const countGroupByOptions = [
            { value: GroupByTime.ByYear, name: 'Year' },
            { value: GroupByTime.ByMonthOfYear, name: 'Month of Year' },
            { value: GroupByTime.ByMonth, name: 'Month' },
            { value: GroupByTime.ByDayOfWeek, name: 'Day of Week' },
        ];

        return (
            <Container>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <Card.Header>Map</Card.Header>
                            <Card.Body className="padding-0 panel-large">
                                <Map
                                    defaultZoom={12}
                                    defaultCenter={{ lat: 45.798894, lng: 15.908531 }}
                                    refSet={mapRef => this.map = mapRef}
                                >
                                    {movements.map(movement => <Polyline path={movement.trackings} options={{ strokeColor: movement.color }} />)}
                                    {[MapMode.DaysInRectanlge, MapMode.HeatmapInRectangle, MapMode.TrackingsInRectangle].includes(mapMode) &&
                                        <DrawingManager
                                            defaultDrawingMode={google.maps.drawing.OverlayType.RECTANGLE}
                                            onRectangleComplete={this.onSelectComplete}
                                        />
                                    }
                                    {this.state.selectedTracking &&
                                        <Marker
                                            position={{ lat: this.state.selectedTracking.lat, lng: this.state.selectedTracking.lng }}
                                            title={`Location at ${this.state.selectedTracking.timestamp}`}
                                        />
                                    }
                                    {this.state.heatMapData &&
                                        <HeatmapLayer data={this.state.heatMapData} />
                                    }
                                    {this.state.geohashRectangles.map(rectangle => <Rectangle options={{ strokeColor: '#32a852', fillColor: '#32a852', strokeWeight: 1 }} bounds={{ north: rectangle[2], south: rectangle[0], east: rectangle[3], west: rectangle[1] }} />)}
                                </Map>
                            </Card.Body>
                            <Card.Footer className="flex-container">
                                <ToggleButtonGroup type="radio" name="options" value={this.state.mapMode} onChange={this.onMapModeChange}>
                                    <ToggleButton id="map-mode-move" value={MapMode.Move}><FontAwesome name="arrows" /> Move</ToggleButton>
                                    <ToggleButton id="map-mode-days" value={MapMode.DaysInRectanlge}><FontAwesome name="calendar" /> Days</ToggleButton>
                                    <ToggleButton id="map-mode-trackings" value={MapMode.TrackingsInRectangle}><FontAwesome name="calendar" /> Movement</ToggleButton>
                                    <ToggleButton id="map-mode-heatmap" value={MapMode.HeatmapInRectangle}><FontAwesome name="map-o" /> Heatmap</ToggleButton>
                                    <ToggleButton id="map-mode-geohash" value={MapMode.Geohash}><FontAwesome name="map-o" /> Geohash</ToggleButton>
                                </ToggleButtonGroup>
                                <Datetime dateFormat="YYYY-MM-DD" timeFormat={false} value={filters.day} onChange={date => this.onFiltersChanged({ day: date.format('YYYY-MM-DD') })} />
                                <Button onClick={this.loadOnThisDay}>On this day</Button>
                                <Datetime dateFormat="YYYY-MM-DD" timeFormat="HH:mm:ss" onChange={dateTime => this.onLastTrackingAtDate(dateTime.format('YYYY-MM-DD HH:mm'))} />
                            </Card.Footer>
                        </Card>
                        {movement &&
                            <SelectedMovement
                                movement={movement}
                                onTrackingSelected={selectedTracking => this.setState({ selectedTracking })}
                            />
                        }
                        {movements.length > 0 &&
                            <Card>
                                <Card.Header>Movements</Card.Header>
                                <Card.Body>
                                    <Table>
                                        <tbody>
                                            {movements.map(movement => <MovementRow
                                                key={movement.id}
                                                {...movement}
                                                onRemoveClick={this.removeTracking}
                                                onSelect={() => this.setState({ movement })}
                                                onChartsClick={() => this.loadCharts(movement.id)} />)}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        }
                        {datesInsideRectangle.length > 0 &&
                            <Card>
                                <Card.Header>Dates inside rectangle ({datesInsideRectangle.length})</Card.Header>
                                <Card.Body>
                                    <CalendarGrid
                                        dates={datesInsideRectangle}
                                        onDateClick={this.loadDay}
                                    />
                                    <SimpleBarChart
                                        data={this.state.datesInsideRectangleChartData}
                                        name="year"
                                        value="count"
                                    />
                                </Card.Body>
                                <Card.Footer>
                                    <RadioLabel options={countGroupByOptions} onSelect={this.onGClick} />
                                </Card.Footer>
                            </Card>
                        }
                        {this.state.altitudeChartData &&
                            <Card>
                                <Card.Header>
                                    Altitude
                                    <FontAwesome title="Close" name="times" className="pull-right cursor-pointer" onClick={() => this.setState({ altitudeChartData: null })} />
                                </Card.Header>
                                <Card.Body>
                                    <SimpleLineChart
                                        data={this.state.altitudeChartData}
                                        name="time"
                                        unit=" m"
                                        value="altitude"
                                    />
                                </Card.Body>
                            </Card>
                        }
                        {this.state.speedChartData &&
                            <Card>
                                <Card.Header>
                                    Speed
                                    <FontAwesome title="Close" name="times" className="pull-right cursor-pointer" onClick={() => this.setState({ speedChartData: null })} />
                                </Card.Header>
                                <Card.Body>
                                    <SimpleLineChart
                                        data={this.state.speedChartData}
                                        name="time"
                                        unit=" km/h"
                                        value="speed"
                                    />
                                </Card.Body>
                            </Card>
                        }
                    </Col>
                </Row>
            </Container>
        );
    }

    drawGeohash = () => {
        const center = this.map.getCenter();
        const zoom = this.map.getZoom();

        const z = {
            [1]: { precision: 1, search: 0 },
            [2]: { precision: 1, search: 0 },
            [3]: { precision: 2, search: 0 },
            [4]: { precision: 3, search: 1 },
            [5]: { precision: 3, search: 1 },
            [6]: { precision: 4, search: 2 },
            [7]: { precision: 4, search: 2 },
            [8]: { precision: 5, search: 2 },
            [9]: { precision: 5, search: 3 },
            [10]: { precision: 6, search: 3 },
            [11]: { precision: 6, search: 4 },
            [12]: { precision: 6, search: 4 },
            [13]: { precision: 7, search: 5 },
            [14]: { precision: 7, search: 5 },
            [15]: { precision: 8, search: 5 },
            [16]: { precision: 8, search: 6 },
            [17]: { precision: 9, search: 6 }
        };

        const settings = z[zoom > 17 ? 17 : zoom];

        api.geohash.get(geohash.encode(center.lat(), center.lng()).substring(0, settings.search), settings.precision)
            .then(hashes => {
                this.setState({
                    geohashRectangles: hashes.map(hash => geohash.decode_bbox(hash))
                });
            });
    };

    drawHeatmap = (trackings) => {
        this.setState({
            heatMapData: trackings.map(x => new google.maps.LatLng(x.lat, x.lng))
        });
    };

    drawMovements = (trackings) => {
        this.setState({
            movements: [
                ...this.state.movements,
                {
                    id: 'what',
                    trackings,
                    day: 'what',
                    distance: 20,
                    color: this.colors[0],
                }
            ],
        });
    };

    loadCharts = (movementId: string) => {
        const trackings = this.state.movements.find(x => x.id === movementId)!.trackings;
        this.setState({
            altitudeChartData: trackings.map(tracking => ({ altitude: Math.ceil(tracking.altitude), time: moment(tracking.timestamp).format('HH:mm') })),
            speedChartData: trackings.map(tracking => ({ speed: Math.ceil(tracking.speed * 3.6), time: moment(tracking.timestamp).format('HH:mm') })),
        });
    };

    loadDay = (day: string) => {
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
    };

    loadOnThisDay = () => {
        for (let year = 2014; year <= moment().year(); year++) {
            this.loadDay(moment().year(year).format('YYYY-MM-DD'));
        }
    };

    onFiltersChanged = (filterValue?) => {
        const filters = this.resolveFilters(this.state.filters, filterValue);

        if (!filters.day) {
            filters.day = moment().format('YYYY-MM-DD');
        }

        this.pushHistoryState(filters);
        this.setState({ filters });
        this.loadDay(filters.day);
    };

    onG = () => {
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
    };

    onGClick = (groupDatesInsideRectangle: GroupByTime) => {
        this.setState({ groupDatesInsideRectangle }, this.onG);
    };

    onLastTrackingAtDate = (dateTime: string) => {
        api.tracking
            .getLast({ at: dateTime })
            .then(selectedTracking => this.setState({ selectedTracking }));
    };

    onMapModeChange = (mapMode: MapMode) => {
        if (mapMode === MapMode.Geohash){
            this.drawGeohash();
        }

        this.setState({ mapMode });
    };

    onSelectComplete = (rectangle: google.maps.Rectangle) => {
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

        const { mapMode } = this.state;

        if (mapMode === MapMode.DaysInRectanlge) {
            api.tracking
                .getDays(filters)
                .then(datesInsideRectangle => this.setState({ datesInsideRectangle }, this.onG));
            return;
        }

        api.tracking
            .get(filters)
            .then(trackings => {
                if (mapMode === MapMode.TrackingsInRectangle) {
                    this.drawMovements(trackings);
                }
                if (mapMode === MapMode.HeatmapInRectangle) {
                    this.drawHeatmap(trackings);
                }
            });
    };

    removeTracking = (id: string) => {
        this.setState({
            movements: _.filter(this.state.movements, t => t.id !== id),
        });
    };
}

export default TrackingPage;
