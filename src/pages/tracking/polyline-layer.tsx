import React from 'react';
import { Badge, Button, Card, Col, Collapse, Form, ListGroup, Row, Stack } from 'react-bootstrap';
import moment from 'moment';
import mtz from 'moment-timezone';
import momentDurationFormatSetup from 'moment-duration-format';
import { AiOutlineScissor } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';
import { BiStopwatch } from 'react-icons/bi';
import { ImRoad } from 'react-icons/im';
import { RiPinDistanceFill } from 'react-icons/ri';
import * as geometry from 'spherical-geometry-js';
import Slider from 'rc-slider';

import { components } from 'types/ivy-types';
import MarkerControl from './marker-control';
import { PolygonLayer } from 'models/layers';
import { trackingToLatLng } from 'utils/gmap-helper';
import { FaChevronDown, FaHashtag, FaMountain } from 'react-icons/fa';
import { polylineColors } from './constants';

momentDurationFormatSetup(moment);

export enum MarkerType {
    End,
    Start,
}

export enum RewindDirection {
    Forward,
    Reverse,
}

type Tracking = components['schemas']['Tracking'];

interface Props {
    layer: PolygonLayer,
    timezone?: string,
    onClip(): void,
    onColorChange(color: string): void,
    onEndMarkerMoved(tracking: Tracking): void,
    onRemove(): void,
    onShowStopsToggle(): void,
    onShowTrackingsToggle(): void,
    onStartMarkerMoved(tracking: Tracking): void,
}

const PolylineLayer = ({ layer, timezone, onClip, onColorChange, onRemove, onEndMarkerMoved, onShowStopsToggle, onStartMarkerMoved, onShowTrackingsToggle }: Props) => {

    const [colorsOpen, setColorsOpen] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [endIndex, setEndIndex] = React.useState(layer.trackings.length - 1);
    const [startIndex, setStartIndex] = React.useState(0);

    const determineIndex = (index: number) => index < 0 ? 0 : index >= layer.trackings.length ? layer.trackings.length - 1 : index;

    React.useEffect(() => {
        onChange(0, layer.trackings.length - 1);
    }, [layer.trackings]);

    const onChange = (startIndex: number, endIndex: number) => {
        setEndIndex(determineIndex(endIndex));
        setStartIndex(determineIndex(startIndex));
        layer.endTracking = layer.trackings[endIndex];
        layer.startTracking = layer.trackings[startIndex];

        onEndMarkerMoved(layer.endTracking);
        onStartMarkerMoved(layer.startTracking);
    };

    const onStep = (markerType: MarkerType, direction: RewindDirection) => {
        const index = markerType === MarkerType.Start ? startIndex : endIndex;

        for (let i = 0; i < layer.segments.length; i++) {
            if (layer.segments[i].endIndex >= index && index >= layer.segments[i].startIndex) {

                // First stop
                if (i === 0) {
                    if (direction === RewindDirection.Reverse && markerType === MarkerType.Start) {
                        onChange(0, endIndex);
                    }
                }

                // Last stop
                if (i === layer.segments.length - 1) {
                    if (direction === RewindDirection.Forward && markerType === MarkerType.End) {
                        onChange(startIndex, layer.trackings.length - 1);
                    }
                }

                // Middle stops
                if (direction === RewindDirection.Forward) {
                    if (markerType === MarkerType.Start) {
                        onChange(layer.segments[i + 1].startIndex, endIndex);
                    } else {
                        onChange(startIndex, layer.segments[i + 1].startIndex);
                    }
                } else {
                    if (markerType === MarkerType.Start) {
                        onChange(layer.segments[i - 1].endIndex, endIndex);
                    } else {
                        onChange(startIndex, layer.segments[i - 1].endIndex);
                    }
                }
            }
        }
    };

    const getDistanceBetweenTrackings = (from: number, to: number) => {
        let distance = 0;
        for (let i = from; i < (to > layer.trackings.length ? layer.trackings.length : to) - 1; i++) {
            const a = trackingToLatLng(layer.trackings[i]);
            const b = trackingToLatLng(layer.trackings[i + 1]);
            distance += geometry.computeDistanceBetween(a, b);
        }
        return distance > 1000 ? `${Math.round(distance / 1000)}km` : `${Math.round(distance)}m`;
    };

    const distanceFormatted = getDistanceBetweenTrackings(0, layer.trackings.length);
    const distanceBetweenMarkersFormatted = getDistanceBetweenTrackings(startIndex, endIndex);
    const currentColor = polylineColors.find(color => color.value === layer.color) ?? { name: 'Current', value: layer.color };
    const visibleColors = colorsOpen ? polylineColors : [currentColor];
    const detailsId = `polyline-layer-${layer.id}`;

    const toZonedMoment = (timestamp?: string) => {
        if (!timestamp) {
            return moment.invalid();
        }

        return timezone ? mtz.utc(timestamp).tz(timezone) : moment(timestamp);
    };

    const layerStart = toZonedMoment(layer.trackings[0]?.timestamp);
    const layerEnd = toZonedMoment(layer.trackings[layer.trackings.length - 1]?.timestamp);
    const dateLabel = !layerStart.isValid()
        ? '—'
        : layerStart.isSame(layerEnd, 'day')
            ? layerStart.format('dddd, D MMMM YYYY')
            : layerStart.year() === layerEnd.year()
                ? `${layerStart.format('ddd, D MMM')} – ${layerEnd.format('ddd, D MMM YYYY')}`
                : `${layerStart.format('ddd, D MMM YYYY')} – ${layerEnd.format('ddd, D MMM YYYY')}`;

    return (
        <Card style={{ borderTop: `4px solid ${layer.color}` }}>
            <Card.Header className="p-0">
                <div className="d-flex align-items-stretch">
                    <button
                        type="button"
                        className="flex-grow-1 border-0 bg-transparent text-body text-start px-3 py-2"
                        style={{ cursor: 'pointer' }}
                        aria-expanded={expanded}
                        aria-controls={detailsId}
                        onClick={() => setExpanded(open => !open)}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <div className="flex-grow-1">
                                <div className="small text-muted fw-normal">Date</div>
                                <div className="fw-semibold">{dateLabel}</div>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="small text-muted fw-normal">Distance</div>
                                <div className="fw-semibold text-nowrap">
                                    <ImRoad className="me-1" aria-hidden />
                                    {distanceFormatted}
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="small text-muted fw-normal">Points</div>
                                <div className="fw-semibold text-nowrap">
                                    <FaHashtag className="me-1" aria-hidden />
                                    {layer.trackings.length}
                                </div>
                            </div>
                            <FaChevronDown
                                className="flex-shrink-0 text-muted"
                                aria-hidden
                                style={{
                                    transform: expanded ? 'rotate(180deg)' : 'none',
                                    transition: 'transform 0.2s ease',
                                }}
                            />
                            <span className="visually-hidden">{expanded ? 'Collapse' : 'Expand'}</span>
                        </div>
                    </button>
                    <button
                        type="button"
                        className="border-0 bg-transparent text-body px-3"
                        style={{ cursor: 'pointer' }}
                        aria-label="Remove"
                        title="Remove"
                        onClick={onRemove}
                    >
                        <IoMdClose size={20} />
                    </button>
                </div>
            </Card.Header>
            <Collapse in={expanded}>
                <div id={detailsId}>
                    <Card.Body className="border-top">
                        <Stack gap={3}>
                            <div className="d-flex flex-wrap align-items-center gap-3">
                                <Button size="sm" onClick={onClip}>
                                    <AiOutlineScissor /> Clip
                                </Button>
                                <Form.Check
                                    className="mb-0"
                                    checked={layer.showStops}
                                    onChange={e => onShowStopsToggle(layer, e.currentTarget.checked)}
                                    label="Show stops"
                                />
                                <Form.Check
                                    className="mb-0"
                                    checked={layer.showTrackings}
                                    onChange={e => onShowTrackingsToggle(layer, e.currentTarget.checked)}
                                    label="Show trackings"
                                />
                            </div>
                            <div>
                                <Form.Label className="mb-2">Color</Form.Label>
                                <div
                                    className="d-flex flex-wrap gap-2"
                                    role={colorsOpen ? 'radiogroup' : undefined}
                                    aria-label="Polyline color"
                                >
                                    {visibleColors.map(color => {
                                        const selected = layer.color === color.value;

                                        return (
                                            <button
                                                key={color.name}
                                                type="button"
                                                role={colorsOpen ? 'radio' : undefined}
                                                aria-checked={colorsOpen ? selected : undefined}
                                                aria-expanded={colorsOpen}
                                                aria-label={colorsOpen ? color.name : `Change color, current ${color.name}`}
                                                title={color.name}
                                                className="rounded-circle p-0"
                                                style={{
                                                    width: 22,
                                                    height: 22,
                                                    backgroundColor: color.value,
                                                    appearance: 'none',
                                                    border: '1px solid rgba(var(--bs-emphasis-color-rgb), 0.35)',
                                                    boxShadow: selected ? '0 0 0 2px var(--bs-body-bg), 0 0 0 4px var(--bs-body-color)' : undefined,
                                                    cursor: 'pointer',
                                                    flexShrink: 0,
                                                }}
                                                onClick={() => {
                                                    if (!colorsOpen) {
                                                        setColorsOpen(true);
                                                        return;
                                                    }

                                                    onColorChange(color.value);
                                                    setColorsOpen(false);
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <Slider
                                    allowCross={false}
                                    max={layer.trackings.length - 1}
                                    min={0}
                                    onChange={c => onChange(c[0], c[1])}
                                    range
                                    step={1}
                                    value={[startIndex, endIndex]}
                                />
                                <Row className="mt-3">
                                    <Col md={6}>
                                        <MarkerControl
                                            nextExists={endIndex - startIndex > 1}
                                            previousExists={startIndex > 0}
                                            timezone={timezone}
                                            tracking={layer.startTracking}
                                            onNext={() => onChange(startIndex + 1, endIndex)}
                                            onPrevious={() => onChange(startIndex - 1, endIndex)}
                                            onStep={(direction: RewindDirection) => onStep(MarkerType.Start, direction)}
                                        />
                                    </Col>
                                    <Col md={6} className="mt-3 mt-md-0 d-flex justify-content-md-end">
                                        <div className="ms-md-auto">
                                            <MarkerControl
                                                nextExists={layer.trackings.length > endIndex + 1}
                                                previousExists={endIndex - startIndex > 1}
                                                timezone={timezone}
                                                tracking={layer.endTracking}
                                                onNext={() => onChange(startIndex, endIndex + 1)}
                                                onPrevious={() => onChange(startIndex, endIndex - 1)}
                                                onStep={(direction: RewindDirection) => onStep(MarkerType.End, direction)}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="d-flex flex-wrap gap-4">
                                <div>
                                    <div className="small text-muted">Time</div>
                                    <div>
                                        <BiStopwatch title="Time between trackings" />
                                        &nbsp;{moment.duration(moment(layer.endTracking.timestamp).diff(moment(layer.startTracking.timestamp))).format()}
                                    </div>
                                </div>
                                <div>
                                    <div className="small text-muted">Between markers</div>
                                    <div>
                                        <RiPinDistanceFill />
                                        &nbsp;{distanceBetweenMarkersFormatted}
                                    </div>
                                </div>
                            </div>
                            <ListGroup>
                                {layer.segments.map((segment, i) => {
                                    const durationMinutes = moment.duration(segment.end.diff(segment.start)).asMinutes().toFixed(0);
                                    const altitude = layer.trackings[segment.endIndex]?.altitude;
                                    const roundedAltitude = altitude != null ? Math.round(altitude) : null;

                                    return (
                                        <ListGroup.Item key={`${segment.startIndex}-${segment.endIndex}-${i}`}>
                                            <div className="d-flex align-items-center flex-wrap gap-2">
                                                <span className="fw-semibold">{`${segment.start.format('HH:mm')} - ${segment.end.format('HH:mm')}`}</span>
                                                <Stack direction="horizontal" gap={2} className="flex-wrap align-items-center">
                                                    <Badge bg="secondary">
                                                        <BiStopwatch className="me-1" />
                                                        {`${durationMinutes} min`}
                                                    </Badge>
                                                    <Badge bg="secondary">
                                                        <FaMountain className="me-1" />
                                                        {roundedAltitude != null ? `${roundedAltitude} m` : '-'}
                                                    </Badge>
                                                    <Badge bg="secondary">
                                                        <FaHashtag className="me-1" />
                                                        {`${segment.endIndex - segment.startIndex} pts`}
                                                    </Badge>
                                                </Stack>
                                            </div>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
                        </Stack>
                    </Card.Body>
                </div>
            </Collapse>
        </Card>
    );

};

export default PolylineLayer;