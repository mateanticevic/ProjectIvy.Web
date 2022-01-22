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
import { trackingsToLatLng, trackingToLatLng } from 'utils/gmap-helper';
import { DrawMode, MapMode } from 'consts/location';
import GeohashSettings from './geohash-settings';
import { GeohashLayer, PolygonLayer, TrackingLayer } from 'models/layers';
import { GeohashFilters } from 'types/geohash';
import PolylineLayer from './polyline-layer';

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
    polygonLayers: PolygonLayer[],
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

interface PolygonProps {
    layers: PolygonLayer[];
}

const Polygons = ({ layers }: PolygonProps) =>
    <React.Fragment>
        {layers.filter(layer => layer.showPoints)
            .map(layer => {
                return layer.trackings.map(tracking =>
                    <Marker
                        key={_.uniqueId()}
                        icon="https://img.icons8.com/material-outlined/24/000000/filled-circle--v1.png"
                        position={trackingToLatLng(tracking)}
                        onClick={() => this.selectTracking(tracking)}
                    />
                );
            })}
    </React.Fragment>;

const areLayersEqual = (oldProps: PolygonProps, newProps: PolygonProps) => {
    const oldLayers = oldProps.layers;
    const newLayers = newProps.layers;

    if (oldLayers.length !== newLayers.length || oldLayers.length === 0) {
        return false;
    }

    for (let i = 0; i < oldLayers.length; i++) {
        const oldPolygonLayer = oldLayers[i];
        const newPolygonLayer = newLayers[i];
        if (oldPolygonLayer.showPoints !== newPolygonLayer.showPoints
            || oldPolygonLayer.trackings.length !== newPolygonLayer.trackings.length) {
            return false;
        }
    }
    return true;
};

const PolygonsMemo = React.memo(Polygons, areLayersEqual);

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
        polygonLayers: [],
        requestActive: false,
    }

    componentDidMount() {
        api.tracking.getLastLocation()
            .then(response => this.setState({ last: response.tracking }));
    }

    render() {

        const { dateMode, drawMode, last, layers, geohashPrecision, geohashSearch, mapMode, mapZoom, polygonLayers, requestActive } = this.state;

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
                                        <ToggleButton id="date-mode-day" value={DateMode.Day}><MdToday /> Day</ToggleButton>
                                        <ToggleButton id="date-mode-range" value={DateMode.Range}><FaRegCalendarAlt /> Range</ToggleButton>
                                        <ToggleButton id="date-mode-last" value={DateMode.Last}><Ri24HoursFill /> Last</ToggleButton>
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
                                        {polygonLayers.map(layer =>
                                            <Polyline
                                                key={layer.id}
                                                path={trackingsToLatLng(layer.trackings)}
                                            />
                                        )}
                                        <PolygonsMemo layers={polygonLayers} />
                                        {layers.filter(layer => layer instanceof TrackingLayer).map(layer => layer as TrackingLayer).map(layer =>
                                            <Marker
                                                key={layer.id}
                                                position={trackingToLatLng(layer.tracking)}
                                            />
                                        )}
                                        {polygonLayers.map(layer =>
                                            <React.Fragment key={layer.id}>
                                                <Marker
                                                    key={`${layer.id}-end`}
                                                    position={trackingToLatLng(layer.endTracking)}
                                                />
                                                <Marker
                                                    key={`${layer.id}-start`}
                                                    position={trackingToLatLng(layer.startTracking)}
                                                />
                                            </React.Fragment>
                                        )}
                                        {layers.filter(layer => layer instanceof GeohashLayer)
                                            .map(layer => layer as GeohashLayer)
                                            .flatMap(layer => layer.elements)
                                            .map(element =>
                                                <Rectangle
                                                    key={_.uniqueId()}
                                                    options={{ strokeColor: '#32a852', fillColor: '#32a852', strokeWeight: 1 }}
                                                    bounds={{ north: element.rectangle[2], south: element.rectangle[0], east: element.rectangle[3], west: element.rectangle[1] }}
                                                    onClick={() => console.log(element.id)}
                                                />
                                            )}
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
                                    <ToggleButton id="map-mode-drag" value={MapMode.Drag}><RiDragMove2Fill /> Drag</ToggleButton>
                                    <ToggleButton id="map-mode-drop" value={MapMode.Drop}><MdLocationOn /> Drop</ToggleButton>
                                    <ToggleButton id="map-mode-select" value={MapMode.Select}><BiRectangle /> Select</ToggleButton>
                                </ToggleButtonGroup>
                            </Card.Footer>
                        </Card>
                        {polygonLayers.map(layer =>
                            <PolylineLayer
                                key={layer.id}
                                layer={layer}
                                onEndMarkerMoved={tracking => this.onEndMarkerMoved(layer, tracking)}
                                onClip={() => this.onPolygonClip(layer)}
                                onStartMarkerMoved={tracking => this.onStartMarkerMoved(layer, tracking)}
                                onShowPointsToggle={this.onPointsShow}
                            />
                        )}
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

    deleteTracking = (layer: PolygonLayer, tracking: Tracking) => {
        api.tracking.del(moment.utc(tracking.timestamp).format('x'))
            .then(() => {
                const updatedLayer = {
                    ...layer,
                    trackings: layer.trackings.filter(x => x != tracking)
                };
                const layers = [
                    ...this.state.layers.filter(x => x != layer).map(layer => layer as PolygonLayer),
                    updatedLayer as PolygonLayer,
                ];
                this.setState({
                    layers
                });
            });
    }

    draw = () => {
        this.setState({ requestActive: true });

        if (this.state.drawMode === DrawMode.Geohash) {
            return this.drawGeohash();
        }

        api.tracking.get(this.dateFilter()).then(trackings => {
            const layer = new PolygonLayer(trackings);
            this.setState({
                polygonLayers: [
                    ...this.state.polygonLayers,
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
                const elements = hashes.map(hash => {
                    return {
                        id: hash,
                        rectangle: geohash.decode_bbox(hash),
                    };
                });
                const layer = new GeohashLayer(elements);
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

    onEndMarkerMoved = (layer: PolygonLayer, endTracking: Tracking) => {
        const updatedLayer = {
            ...layer,
            endTracking,
        } as PolygonLayer;
        const polygonLayers = [
            ...this.state.polygonLayers,
            updatedLayer,
        ];
        this.setState({ polygonLayers });
    }

    onPolygonClip = (layer: PolygonLayer) => {
        const updatedLayer = {
            ...layer,
            trackings: layer.trackings.slice(layer.trackings.indexOf(layer.startTracking), layer.trackings.indexOf(layer.endTracking)),
        } as PolygonLayer;
        const polygonLayers = [
            ...this.state.polygonLayers.filter(x => x !== layer),
            updatedLayer,
        ];
        this.setState({ polygonLayers });
    }

    onPointsShow = (layer: PolygonLayer, showPoints: boolean) => {
        const updatedLayer = {
            ...layer,
            showPoints,
        } as PolygonLayer;
        const polygonLayers = [
            ...this.state.polygonLayers.filter(x => x != layer),
            updatedLayer,
        ];
        this.setState({ polygonLayers });
    }

    onStartMarkerMoved = (layer: PolygonLayer, startTracking: Tracking) => {
        const updatedLayer = {
            ...layer,
            startTracking,
        } as PolygonLayer;
        const polygonLayers = [
            ...this.state.polygonLayers.filter(x => x != layer),
            updatedLayer,
        ];
        this.setState({ polygonLayers });
    }

    selectTracking = (tracking: Tracking) => {
        const layer = new TrackingLayer(tracking);
        this.setState({
            layers: [
                ...this.state.layers,
                layer,
            ]
        });
    }
}

export default LocationPage;