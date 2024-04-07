import React from 'react';
import { Card, Col, Container, FormGroup, FormLabel, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import geohash from 'ngeohash';
import { BiRectangle } from 'react-icons/bi';
import { InfoWindow, Marker, Polyline, Rectangle, MarkerClusterer, MarkerF } from '@react-google-maps/api';
import { MdDelete, MdLocationOn, MdToday } from 'react-icons/md';
import { FaDrawPolygon, FaHashtag, FaPlus, FaRegCalendarAlt } from 'react-icons/fa';
import { Ri24HoursFill, RiDragMove2Fill } from 'react-icons/ri';
import moment from 'moment';
import mtz from 'moment-timezone';
import _ from 'lodash';
import ReactSelect from 'react-select';

import { Page } from 'pages/page';
import { DateFormElement, Map, Select } from 'components';
import { components } from 'types/ivy-types';
import api from 'api/main';
import ButtonWithSpinner from 'components/button-with-spinner';
import { Geohash, Layer } from 'types/location';
import { pointsToLatLng, trackingsToLatLng, trackingToLatLng } from 'utils/gmap-helper';
import { DrawMode, MapMode, NewType } from 'consts/location';
import { GeohashLayer, PolygonLayer, TrackingLayer } from 'models/layers';
import { GeohashFilters } from 'types/geohash';
import PolylineLayer from './polyline-layer';
import GeohashInfo from './geohash-info';
import { iconUrl } from 'utils/cdn-helper';
import NewTrackingModal from './new-tracking-modal';
import AsyncSelect from 'react-select/async';
import { locationLoader, routeLoader } from 'utils/select-loaders';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import NewLocationModal from './new-location-modal';
import { CgDetailsMore } from 'react-icons/cg';
import { DateMode, LastNDays, PolygonProps, geohashCharacters, lastNDaysMapping, lastNDaysOptions, rectangleOptionsNonVisited, rectangleOptionsSelected, rectangleOptionsVisited } from './constants';

type Route = components['schemas']['Route'];
type Tracking = components['schemas']['Tracking'];
type LocationType = components['schemas']['LocationType'];
type LocationBinding = components['schemas']['LocationBinding'];
type TrackingBinding = components['schemas']['TrackingBinding'];

interface State {
    dateMode: DateMode,
    drawMode: DrawMode,
    filterDay?: string,
    geohashPrecision: number,
    geohashSearch: number,
    geohashSegments: string[],
    last?: Tracking,
    lastNDays: LastNDays,
    layers: Layer[],
    locationTypes: LocationType[],
    mapMode: MapMode,
    mapZoom: number,
    newLocationModalOpened: boolean,
    newTrackingModalOpened: boolean,
    newLocation: LocationBinding,
    newTracking: TrackingBinding,
    newType: NewType,
    polygonLayers: PolygonLayer[],
    requestActive: boolean,
    routes: Route[],
    routePoints: RoutePoints[],
    routeLayers: google.maps.LatLng[],
    selectedGeohashLayers: [],
    selectedGeohashes: string[],
    selectedGeohashItems: Geohash[],
    visitedGeohashes: string[],
    timezone?: string,
}



const areLayersEqual = (oldProps: PolygonProps, newProps: PolygonProps) => {
    const oldLayers = oldProps.layers;
    const newLayers = newProps.layers;

    if (oldLayers.length !== newLayers.length || oldLayers.length === 0) {
        return false;
    }

    for (let i = 0; i < oldLayers.length; i++) {
        const oldPolygonLayer = oldLayers[i];
        const newPolygonLayer = newLayers[i];
        if (oldPolygonLayer.showTrackings !== newPolygonLayer.showTrackings
            || oldPolygonLayer.showStops !== newPolygonLayer.showStops
            || oldPolygonLayer.trackings.length !== newPolygonLayer.trackings.length) {
            return false;
        }
    }
    return true;
};

class TrackingPage extends Page<unknown, State> {

    map?: google.maps.Map;

    state: State = {
        dateMode: DateMode.Day,
        drawMode: DrawMode.Line,
        geohashPrecision: 7,
        geohashSearch: 5,
        geohashSegments: geohashCharacters,
        lastNDays: LastNDays.One,
        layers: [],
        locationTypes: [],
        mapMode: MapMode.Drag,
        mapZoom: 0,
        newLocationModalOpened: false,
        newTrackingModalOpened: false,
        newLocation: {
        },
        newTracking: {
        },
        newType: NewType.Location,
        polygonLayers: [],
        requestActive: false,
        routes: [],
        routePoints: [],
        selectedGeohashLayers: [],
        selectedGeohashes: [],
        selectedGeohashItems: [],
        visitedGeohashes: [],
    };

    componentDidMount() {
        api.tracking.getLastLocation()
            .then(response => this.setState({ last: response.tracking }));

        api.geohash.getChildren('root')
            .then(visitedGeohashes => this.setState({ visitedGeohashes }));

        api.location.getTypes()
            .then(locationTypes => this.setState({ locationTypes }));
    };

    render() {

        const { dateMode, drawMode, last, layers, geohashSegments, mapMode, locationTypes, polygonLayers, requestActive, selectedGeohashes, selectedGeohashItems, timezone } = this.state;
        const { newLocation, newTracking, newLocationModalOpened, newTrackingModalOpened } = this.state;

        const isMapReady = !!last;

        const timezoneOptions = mtz?.tz?.names()?.map(tz => { return { value: tz, label: tz }; }) ?? [];
        const defaultTimezone = timezoneOptions.find(tz => tz.value == 'Europe/Zagreb');

        if (!this.state.timezone) {
            this.setState({ timezone: defaultTimezone?.value });
        }

        return (
            <Container>
                <Row>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Draw</Card.Header>
                            <Card.Body>
                                <FormGroup>
                                    <FormLabel>Time</FormLabel>
                                    {dateMode == DateMode.Day &&
                                        <DateFormElement onChange={filterDay => this.setState({ filterDay })} />
                                    }
                                    {dateMode == DateMode.Last &&
                                        <FormGroup>
                                            <Select
                                                options={lastNDaysOptions}
                                                hideDefaultOption
                                                onChange={lastNDays => this.setState({ lastNDays: lastNDays as LastNDays })}
                                            />
                                        </FormGroup>
                                    }
                                    <ToggleButtonGroup
                                        name="time-options"
                                        size="sm"
                                        type="radio"
                                        value={dateMode}
                                        onChange={dateMode => this.setState({ dateMode })}
                                    >
                                        <ToggleButton id="date-mode-day" value={DateMode.Day}><MdToday /> Day</ToggleButton>
                                        <ToggleButton id="date-mode-range" value={DateMode.Range}><FaRegCalendarAlt /> Range</ToggleButton>
                                        <ToggleButton id="date-mode-last" value={DateMode.Last}><Ri24HoursFill /> Last</ToggleButton>
                                    </ToggleButtonGroup>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Type</FormLabel>
                                    <ToggleButtonGroup
                                        name="type-options"
                                        size="sm"
                                        type="radio"
                                        value={drawMode}
                                        onChange={drawMode => this.setState({ drawMode })}
                                    >
                                        <ToggleButton id="toggle-mode-line" value={DrawMode.Line}><FaDrawPolygon /> Line</ToggleButton>
                                        <ToggleButton id="toggle-mode-geohash" value={DrawMode.Geohash}><FaHashtag /> Geohash</ToggleButton>
                                    </ToggleButtonGroup>
                                </FormGroup>
                                {/* {drawMode === DrawMode.Geohash &&
                                    <GeohashSettings
                                        precision={geohashPrecision}
                                        search={geohashSearch}
                                        zoom={mapZoom}
                                        onPrecisionChange={geohashPrecision => this.setState({ geohashPrecision })}
                                        onSearchChange={geohashSearch => this.setState({ geohashSearch })}
                                    />
                                } */}
                                <FormGroup>
                                    <FormLabel>Timezone</FormLabel>
                                    <ReactSelect
                                        options={timezoneOptions}
                                        onChange={option => this.setState({ timezone: option.value })}
                                        value={defaultTimezone}
                                    />
                                </FormGroup>
                                <ButtonWithSpinner
                                    isLoading={requestActive}
                                    onClick={this.draw}
                                >
                                    Draw
                                </ButtonWithSpinner>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>Layers</Card.Header>
                            <Card.Body>
                                <FormGroup>
                                    <FormLabel>Locations</FormLabel>
                                    <AsyncSelect
                                        loadOptions={locationLoader}
                                        onChange={route => this.onRouteClick(route.value, route.label)}
                                        defaultOptions
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Routes</FormLabel>
                                    <AsyncSelect
                                        loadOptions={routeLoader}
                                        onChange={route => this.onRouteClick(route.value, route.label)}
                                        defaultOptions
                                    />
                                </FormGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={9}>
                        <Card>
                            <Card.Body className="padding-0 panel-large">
                                {isMapReady &&
                                    <Map
                                        defaultZoom={15}
                                        defaultCenter={{ lat: last.latitude, lng: last.longitude }}
                                        onClick={this.onMapClick}
                                        onZoomChanged={() => this.map && this.setState({ mapZoom: this.map.getZoom() })}
                                        onLoad={map => this.map = map}
                                    >
                                        {polygonLayers.map(layer =>
                                            <Polyline
                                                key={layer.id}
                                                path={trackingsToLatLng(layer.trackings)}
                                                options={{ strokeColor: '#0000FF', strokeWeight: 5 }}
                                            />
                                        )}
                                        <this.renderPointsMemoized layers={polygonLayers} />
                                        <this.renderStopsMemoized layers={polygonLayers} />
                                        {layers.filter(layer => layer instanceof TrackingLayer).map(layer => layer as TrackingLayer).map(layer =>
                                            <Marker
                                                key={layer.id}
                                                position={trackingToLatLng(layer.tracking)}
                                            />
                                        )}
                                        {polygonLayers.map(layer =>
                                            <React.Fragment key={layer.id}>
                                                {layer.endTracking !== layer.trackings[layer.trackings.length - 1] &&
                                                    <Marker
                                                        key={`${layer.id}-trim-out`}
                                                        icon={iconUrl('bracket-right')}
                                                        position={trackingToLatLng(layer.endTracking)}
                                                    />
                                                }
                                                {layer.startTracking !== layer.trackings[0] &&
                                                    <Marker
                                                        key={`${layer.id}-trim-in`}
                                                        icon={iconUrl('bracket-left')}
                                                        position={trackingToLatLng(layer.startTracking)}
                                                    />
                                                }
                                            </React.Fragment>
                                        )}
                                        {drawMode === DrawMode.Geohash && geohashSegments.map(g => {
                                            const rectangle = geohash.decode_bbox(g);
                                            const isSelected = selectedGeohashes.some(s => s === g);

                                            const options = isSelected ? rectangleOptionsSelected
                                                : (this.state.visitedGeohashes.includes(g) ? rectangleOptionsVisited : rectangleOptionsNonVisited);

                                            return (
                                                <Rectangle
                                                    key={_.uniqueId()}
                                                    options={options}
                                                    bounds={{ north: rectangle[2], south: rectangle[0], east: rectangle[3], west: rectangle[1] }}
                                                    onClick={() => this.onGeohashSegmentClick(g)}
                                                />
                                            );
                                        })}
                                        {layers.filter(layer => layer instanceof GeohashLayer)
                                            .map(layer => layer as GeohashLayer)
                                            .flatMap(layer => layer.elements)
                                            .map(element =>
                                                <Rectangle
                                                    key={_.uniqueId()}
                                                    options={{ strokeColor: '#32a852', fillColor: '#32a852', strokeWeight: 1 }}
                                                    bounds={{ north: element.rectangle[2], south: element.rectangle[0], east: element.rectangle[3], west: element.rectangle[1] }}
                                                    onClick={() => this.onSelectGeohash(element.id)}
                                                />
                                            )}
                                        {/* {selectedGeohashItems.map(geohashItem =>
                                            <Rectangle
                                                key={_.uniqueId()}
                                                options={{ strokeColor: '#32a852', fillColor: '#32a852', strokeWeight: 1 }}
                                                bounds={{ north: geohashItem.geohash.rectangle[2], south: element.rectangle[0], east: element.rectangle[3], west: element.rectangle[1] }}
                                                onClick={() => this.onSelectGeohash(element.id)}
                                            />
                                        )} */}
                                        <MarkerClusterer>
                                            {clusterer => {
                                                <>
                                                    {layers.filter(layer => layer instanceof PolygonLayer).map(layer => layer as PolygonLayer).filter(layer => layer.renderAsPoints).map(layer =>
                                                        layer.path.map(point =>
                                                            <MarkerF
                                                                key={_.uniqueId()}
                                                                icon="https://img.icons8.com/material-outlined/24/000000/filled-circle--v1.png"
                                                                position={point}
                                                            />
                                                        )
                                                    )}
                                                </>
                                            }}
                                        </MarkerClusterer>
                                        {this.state.routePoints.map(routePoints =>
                                            <Polyline
                                                key={routePoints.route.id}
                                                path={pointsToLatLng(routePoints.points)}
                                                options={{ strokeColor: '#0a58ca', strokeWeight: 2 }}
                                            />
                                        )}
                                    </Map>
                                }
                            </Card.Body>
                            <Card.Footer>
                                <ToggleButtonGroup
                                    type="radio"
                                    name="options"
                                    value={mapMode}
                                    onChange={mapMode => this.setState({ mapMode })}
                                >
                                    <ToggleButton id="map-mode-drag" value={MapMode.Drag}><RiDragMove2Fill /> Drag</ToggleButton>
                                    <ToggleButton id="map-mode-drop" value={MapMode.Drop}><MdLocationOn /> Drop</ToggleButton>
                                    <ToggleButton id="map-mode-select" value={MapMode.Select}><BiRectangle /> Select</ToggleButton>
                                    <ToggleButton id="map-mode-details" value={MapMode.Details}><CgDetailsMore /> Details</ToggleButton>
                                    <ToggleButton id="map-mode-new" value={MapMode.New}><FaPlus /> New</ToggleButton>
                                    <ToggleButton id="map-mode-delete" value={MapMode.Delete} variant="danger"><MdDelete /> Delete</ToggleButton>
                                </ToggleButtonGroup>
                                {mapMode === MapMode.New &&
                                    <ToggleButtonGroup
                                        type="radio"
                                        name="options"
                                        value={mapMode}
                                        onChange={newType => this.setState({ newType })}
                                    >
                                        <ToggleButton id="new-type-location" value={NewType.Location}><MdLocationOn /> Location</ToggleButton>
                                        <ToggleButton id="new-type-tracking" value={NewType.Tracking}><FaLocationCrosshairs /> Tracking</ToggleButton>
                                    </ToggleButtonGroup>
                                }
                            </Card.Footer>
                        </Card>
                        {polygonLayers.map(layer =>
                            <PolylineLayer
                                key={layer.id}
                                layer={layer}
                                timezone={timezone}
                                onEndMarkerMoved={endTracking => this.onLayerUpdated(layer, { endTracking })}
                                onClip={() => this.onPolygonClip(layer)}
                                onRemove={() => this.onRemoveLayer(layer)}
                                onStartMarkerMoved={startTracking => this.onLayerUpdated(layer, { startTracking })}
                                onShowStopsToggle={() => this.onLayerUpdated(layer, { showStops: !layer.showStops })}
                                onShowTrackingsToggle={() => this.onLayerUpdated(layer, { showTrackings: !layer.showTrackings })}
                            />
                        )}
                        {selectedGeohashItems.map(geohash =>
                            <GeohashInfo
                                key={_.uniqueId()}
                                geohash={geohash}
                                onDelete={() => this.onDeleteGeohashTrackings(geohash)}
                            />
                        )}
                    </Col>
                </Row>
                <NewTrackingModal
                    isOpen={newTrackingModalOpened}
                    tracking={newTracking}
                    onChange={this.onNewTrackingChanged}
                    onClose={() => this.setState({ newTrackingModalOpened: false })}
                    onSave={this.onNewTrackingSave}
                />
                <NewLocationModal
                    isOpen={newLocationModalOpened}
                    location={newLocation}
                    types={locationTypes}
                    onChange={this.onNewLocationChanged}
                    onClose={() => this.setState({ newLocationModalOpened: false })}
                    onSave={this.onNewLocationSave}
                />
            </Container>
        );
    };

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
    };

    draw = () => {
        this.setState({ requestActive: true });

        if (this.state.drawMode === DrawMode.Geohash) {
            return this.drawGeohash();
        }

        const filters = this.dateFilter();
        if (this.state.timezone) {
            filters.from = mtz.tz(filters.from, this.state.timezone).utc().format('YYYY-MM-DD HH:mm');
            filters.to = mtz.tz(filters.to, this.state.timezone).utc().format('YYYY-MM-DD HH:mm');
        }

        api.tracking.get(filters).then(trackings => {
            const layer = new PolygonLayer(trackings);
            this.setState({
                polygonLayers: [
                    ...this.state.polygonLayers,
                    layer,
                ],
                requestActive: false,
            });
        });
    };

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
    };

    onDeleteGeohashTrackings = (geohash: Geohash) => {
        api.geohash.delTrackings(geohash.id)
            .then(() => {
                this.setState({
                    selectedGeohashItems: this.state.selectedGeohashItems.filter(x => x.id != geohash.id)
                });
            });
    };

    onGeohashSegmentClick = (geohashId: string) => {

        if (this.state.mapMode === MapMode.Select) {
            this.onSelectGeohash(geohashId);
            return;
        }

        if (this.state.mapMode === MapMode.Details) {
            api.geohash.getSingle(geohashId)
                .then(geohash => {
                    this.setState({
                        selectedGeohashItems: [
                            ...this.state.selectedGeohashItems,
                            {
                                ...geohash,
                                id: geohashId
                            }
                        ]
                    });
                });
            return;
        }

        api.geohash.getChildren(geohashId)
            .then(visitedGeohashes => this.setState({
                geohashSegments: [
                    ...this.state.geohashSegments.filter(g => g != geohashId),
                    ...geohashCharacters.map(g => `${geohashId}${g}`),
                ],
                visitedGeohashes: [
                    ...this.state.visitedGeohashes,
                    ...visitedGeohashes,
                ]
            }));
    };

    onLayerUpdated = (layer: PolygonLayer, updated: Partial<PolygonLayer>) => {
        const updatedLayer = {
            ...layer,
            ...updated,
        } as PolygonLayer;

        const polygonLayers = [...this.state.polygonLayers];
        polygonLayers.splice(polygonLayers.indexOf(layer), 1, updatedLayer);

        this.setState({ polygonLayers });
    };

    onMapClick = (event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
        const { mapMode, newType } = this.state;

        api.country.getSingle(event.latLng.lat(), event.latLng.lng())
            .then();

        if (mapMode === MapMode.New) {
            if (newType === NewType.Location) {
                this.setState({
                    newLocationModalOpened: true,
                    newLocation: {
                        latitude: event.latLng.lat(),
                        longitude: event.latLng.lng(),
                    }
                });
            } else if (newType === NewType.Tracking) {
                this.setState({
                    newTrackingModalOpened: true,
                    newTracking: {
                        latitude: event.latLng.lat(),
                        longitude: event.latLng.lng(),
                    }
                });
            }
        }

        if (mapMode === MapMode.Drop) {
            const layer = new PointLayer(event.latLng);
            this.setState({
                layers: [
                    ...this.state.layers,
                    layer,
                ],
            });
        }
    };

    onMarkerClick = (layer: PolygonLayer, tracking: Tracking) => {
        if (this.state.mapMode !== MapMode.Delete) {
            return;
        }

        api.tracking.del(moment.utc(tracking.timestamp).format('x'))
            .then(() => {
                this.onLayerUpdated(layer, { trackings: layer.trackings.filter(x => x != tracking) });
            });
    };

    onNewLocationChanged = (changed: Partial<LocationBinding>) => {
        this.setState({
            newLocation: {
                ...this.state.newLocation,
                ...changed,
            }
        });
    };

    onNewLocationSave = () => {
        api.location.post(this.state.newLocation)
            .then(() => this.setState({ newLocationModalOpened: false }));
    };

    onNewTrackingChanged = (changed: Partial<TrackingBinding>) => {
        this.setState({
            newTracking: {
                ...this.state.newTracking,
                ...changed,
            }
        });
    };

    onNewTrackingSave = () => {
        api.tracking.post(this.state.newTracking)
            .then(() => this.setState({ newTrackingModalOpened: false }));
    };

    onPolygonClip = (layer: PolygonLayer) => {
        const updatedLayer = {
            ...layer,
            trackings: layer.trackings.slice(layer.trackings.indexOf(layer.startTracking), layer.trackings.indexOf(layer.endTracking)),
        } as PolygonLayer;

        this.onLayerUpdated(layer, updatedLayer);
    };

    onRemoveLayer = (layer: PolygonLayer) => {
        const updatedLayers = this.state.polygonLayers.filter(x => x.id != layer.id);
        this.setState({
            polygonLayers: updatedLayers
        });
    };

    onRouteClick = (id: string, routeName: string) => {
        api.route.getPoints(id)
            .then(routePoints => {
                this.setState({
                    routePoints: [
                        ...this.state.routePoints,
                        {
                            route: {
                                id,
                                name: routeName,
                            },
                            points: routePoints,
                        }
                    ]
                });
            });
    };

    onSelectGeohash = async (id: string) => {
        this.setState({
            selectedGeohashes: [
                ...this.state.selectedGeohashes,
                id,
            ]
        });
    };

    onSelectTracking = (tracking: Tracking) => {
        const layer = new TrackingLayer(tracking);
        this.setState({
            layers: [
                ...this.state.layers,
                layer,
            ]
        });
    };

    renderStops = ({ layers }: PolygonProps) =>
        <React.Fragment>
            {layers.filter(layer => layer.showStops)
                .map(layer => {
                    return layer.stops.map(stop =>
                        <Marker
                            key={_.uniqueId()}
                            icon="https://cdn.anticevic.net/icons/visit-marker.png"
                            position={stop.latLng}
                        >
                            <InfoWindow>
                                <div>{`${stop.start.format('HH:mm')} - ${stop.end.format('HH:mm')}`}</div>
                            </InfoWindow>
                        </Marker>
                    );
                })}
        </React.Fragment>;

    renderStopsMemoized = React.memo(this.renderStops, areLayersEqual);

    renderPoints = ({ layers }: PolygonProps) =>
        <React.Fragment>
            {layers.filter(layer => layer.showTrackings)
                .map(layer => {
                    return layer.trackings.map(tracking =>
                        <Marker
                            key={_.uniqueId()}
                            icon="https://cdn.anticevic.net/icons/location.png"
                            position={trackingToLatLng(tracking)}
                            onClick={() => this.onMarkerClick(layer, tracking)}
                        />
                    );
                })}
        </React.Fragment>;

    renderPointsMemoized = React.memo(this.renderPoints, areLayersEqual);
}

export default TrackingPage;