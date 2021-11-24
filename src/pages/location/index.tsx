import React from 'react';
import { Card, Col, Container, FormGroup, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import geohash from 'ngeohash';
import { BiRectangle } from 'react-icons/bi';
import { GoogleMap, Marker, Polyline, Rectangle } from 'react-google-maps';
import { MdLocationOn, MdToday } from 'react-icons/md';
import { FaDrawPolygon, FaHashtag, FaRegCalendarAlt } from 'react-icons/fa';
import { Ri24HoursFill, RiDragMove2Fill } from 'react-icons/ri';
import moment from 'moment';
import _ from 'lodash';

import { Page } from 'pages/Page';
import { DateFormElement, Map, Select } from 'components';
import { components } from 'types/ivy-types';
import api from 'api/main';
import ButtonWithSpinner from 'components/ButtonWithSpinner';
import { Layer } from 'types/location';
import { trackingsToLatLng } from 'utils/gmap-helper';
import { DrawMode, MapMode } from 'consts/location';
import GeohashSettings from './geohash-settings';
import { GeohashLayer, PointLayer, PolygonLayer } from 'models/layers';
import { GeohashFilters } from 'types/geohash';

type Tracking = components['schemas']['Tracking'];

const { MarkerClusterer } = require('react-google-maps/lib/components/addons/MarkerClusterer');

interface State {
    dateMode: DateMode,
    drawMode: DrawMode,
    filterDay?: string,
    geohashPrecision: number,
    geohashSearch: number,
    last?: Tracking,
    lastNDays: LastNDays,
    layers: Layer[],
    mapMode: MapMode,
    mapZoom: number,
    requestActive: boolean,
}

enum DateMode {
    Day,
    Range,
    Last
}

enum LastNDays {
    One = 'one',
    Week = 'week',
    Month = 'month',
    Year = 'year'
}

const lastNDaysOptions = [
    { id: LastNDays.One, name: '24 hours' },
    { id: LastNDays.Week, name: 'Week' },
    { id: LastNDays.Month, name: 'Month' },
    { id: LastNDays.Year, name: 'Year' },
];

const lastNDaysMapping = {
    [LastNDays.One]: 1,
    [LastNDays.Week]: 7,
    [LastNDays.Month]: 31,
    [LastNDays.Year]: 365,
};

class LocationPage extends Page<{}, State> {

    map: GoogleMap;

    state: State = {
        dateMode: DateMode.Day,
        drawMode: DrawMode.Line,
        geohashPrecision: 7,
        geohashSearch: 5,
        lastNDays: LastNDays.One,
        layers: [],
        mapMode: MapMode.Drag,
        mapZoom: 13,
        requestActive: false,
    }

    componentDidMount() {
        api.tracking.getLastLocation()
            .then(response => this.setState({ last: response.tracking }));
    }

    render() {

        const { dateMode, drawMode, last, layers, geohashPrecision, geohashSearch, mapMode, mapZoom, requestActive } = this.state;

        const isMapReady = !!last;

        return (
            <Container>
                <Row>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Draw</Card.Header>
                            <Card.Body>
                                <FormGroup>
                                    <ToggleButtonGroup type="radio" name="options" value={dateMode} onChange={dateMode => this.setState({ dateMode })}>
                                        <ToggleButton value={DateMode.Day}><MdToday /> Day</ToggleButton>
                                        <ToggleButton value={DateMode.Range}><FaRegCalendarAlt /> Range</ToggleButton>
                                        <ToggleButton value={DateMode.Last}><Ri24HoursFill /> Last</ToggleButton>
                                    </ToggleButtonGroup>
                                </FormGroup>
                                {dateMode == DateMode.Day &&
                                    <DateFormElement onChange={filterDay => this.setState({ filterDay })} />
                                }
                                {dateMode == DateMode.Last &&
                                    <FormGroup>
                                        <Select
                                            options={lastNDaysOptions}
                                            onChange={lastNDays => this.setState({ lastNDays: lastNDays as LastNDays })}
                                        />
                                    </FormGroup>
                                }
                                <FormGroup>
                                    <ToggleButtonGroup type="radio" name="options" value={drawMode} onChange={drawMode => this.setState({ drawMode })}>
                                        <ToggleButton id="toggle-mode-line" value={DrawMode.Line}><FaDrawPolygon /> Line</ToggleButton>
                                        <ToggleButton id="toggle-mode-geohash" value={DrawMode.Geohash}><FaHashtag /> Geohash</ToggleButton>
                                    </ToggleButtonGroup>
                                </FormGroup>
                                {drawMode === DrawMode.Geohash &&
                                    <GeohashSettings
                                        precision={geohashPrecision}
                                        search={geohashSearch}
                                        zoom={mapZoom}
                                        onPrecisionChange={geohashPrecision => this.setState({ geohashPrecision })}
                                        onSearchChange={geohashSearch => this.setState({ geohashSearch })}
                                    />
                                }
                                <ButtonWithSpinner
                                    isLoading={requestActive}
                                    onClick={this.draw}
                                >
                                    Draw
                                </ButtonWithSpinner>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={9}>
                        <Card>
                            <Card.Header>Map</Card.Header>
                            <Card.Body className="padding-0 panel-large">
                                {isMapReady &&
                                    <Map
                                        defaultZoom={mapZoom}
                                        defaultCenter={{ lat: last.latitude, lng: last.longitude }}
                                        onClick={this.onMapClick}
                                        onZoomChanged={() => this.setState({ mapZoom: this.map.getZoom() })}
                                        refSet={mapRef => this.map = mapRef}
                                    >
                                        {layers.filter(layer => layer instanceof PolygonLayer).map(layer => layer as PolygonLayer).filter(layer => !layer.renderAsPoints).map(layer =>
                                            <Polyline
                                                key={layer.id}
                                                path={layer.path}
                                            />
                                        )}
                                        {layers.filter(layer => layer instanceof PointLayer).map(layer => layer as PointLayer).map(layer =>
                                            <Marker
                                                key={layer.id}
                                                position={layer.point}
                                            />
                                        )}
                                        {layers.filter(layer => layer instanceof GeohashLayer).map(layer => layer as GeohashLayer).flatMap(layer => layer.rectangles).map(rectangle => <Rectangle options={{ strokeColor: '#32a852', fillColor: '#32a852', strokeWeight: 1 }} bounds={{ north: rectangle[2], south: rectangle[0], east: rectangle[3], west: rectangle[1] }} />)}
                                        <MarkerClusterer>
                                            {layers.filter(layer => layer instanceof PolygonLayer).map(layer => layer as PolygonLayer).filter(layer => layer.renderAsPoints).map(layer =>
                                                layer.path.map(point =>
                                                    <Marker
                                                        key={_.uniqueId()}
                                                        icon="https://img.icons8.com/material-outlined/24/000000/filled-circle--v1.png"
                                                        position={point}
                                                    />
                                                )
                                            )}
                                        </MarkerClusterer>
                                    </Map>
                                }
                            </Card.Body>
                            <Card.Footer>
                                <ToggleButtonGroup type="radio" name="options" value={mapMode} onChange={mapMode => this.setState({ mapMode })}>
                                    <ToggleButton value={MapMode.Drag}><RiDragMove2Fill /> Drag</ToggleButton>
                                    <ToggleButton value={MapMode.Drop}><MdLocationOn /> Drop</ToggleButton>
                                    <ToggleButton value={MapMode.Select}><BiRectangle /> Select</ToggleButton>
                                </ToggleButtonGroup>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    dateFilter = () => {
        const { dateMode, filterDay, lastNDays } = this.state;
        if (dateMode === DateMode.Day && filterDay) {
            return {
                from: filterDay,
                to: moment(filterDay).add(1, 'days').format('YYYY-MM-DD')
            };
        }
        else if (dateMode === DateMode.Last)
            return {
                from: moment().subtract(lastNDaysMapping[lastNDays], 'day').format('YYYY-MM-DD')
            };
        return {

        };
    }

    draw = () => {
        this.setState({ requestActive: true });

        if (this.state.drawMode === DrawMode.Geohash) {
            return this.drawGeohash();
        }

        api.tracking.get(this.dateFilter()).then(trackings => {
            const layer = new PolygonLayer(trackingsToLatLng(trackings));
            this.setState({
                layers: [
                    ...this.state.layers,
                    layer,
                ],
                requestActive: false,
            });
        });
    }

    drawGeohash = () => {
        const { geohashPrecision, geohashSearch } = this.state;
        const center = this.map.getCenter();

        const filters: GeohashFilters = {
            geohash: geohash.encode(center.lat(), center.lng()).substring(0, geohashSearch),
            precision: geohashPrecision,
            ...this.dateFilter(),
        };

        api.geohash.get(filters)
            .then(hashes => {
                const layer = new GeohashLayer(hashes.map(hash => geohash.decode_bbox(hash)));
                this.setState({
                    layers: [
                        ...this.state.layers,
                        layer,
                    ],
                    requestActive: false,
                });
            });
    }

    onMapClick = (event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
        if (this.state.mapMode === MapMode.Drop) {
            const layer = new PointLayer(event.latLng);
            this.setState({
                layers: [
                    ...this.state.layers,
                    layer,
                ],
            });
        }
    }
}

export default LocationPage;