import React from 'react';
import { Button, ButtonGroup, Card, Form, ToggleButton } from 'react-bootstrap';;
import moment from 'moment';
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
import { FaHashtag } from 'react-icons/fa';

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
    onEndMarkerMoved(tracking: Tracking): void,
    onRemove(): void,
    onShowStopsToggle(): void,
    onShowTrackingsToggle(): void,
    onStartMarkerMoved(tracking: Tracking): void,
}

const PolylineLayer = ({ layer, timezone, onClip, onRemove, onEndMarkerMoved, onShowStopsToggle, onStartMarkerMoved, onShowTrackingsToggle }: Props) => {

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

        for (let i = 0; i < layer.stops.length; i++) {
            if (layer.stops[i].endIndex >= index && index >= layer.stops[i].startIndex) {

                // First stop
                if (i === 0) {
                    if (direction === RewindDirection.Reverse && markerType === MarkerType.Start) {
                        onChange(0, endIndex);
                    }
                }

                // Last stop
                if (i === layer.stops.length - 1) {
                    if (direction === RewindDirection.Forward && markerType === MarkerType.End) {
                        onChange(startIndex, layer.trackings.length - 1);
                    }
                }

                // Middle stops
                if (direction === RewindDirection.Forward) {
                    if (markerType === MarkerType.Start) {
                        onChange(layer.stops[i + 1].startIndex, endIndex);
                    } else {
                        onChange(startIndex, layer.stops[i + 1].startIndex);
                    }
                } else {
                    if (markerType === MarkerType.Start) {
                        onChange(layer.stops[i - 1].endIndex, endIndex);
                    } else {
                        onChange(startIndex, layer.stops[i - 1].endIndex);
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

    return (
        <Card>
            <Card.Body>
                <Button onClick={onClip}>
                    <AiOutlineScissor /> Clip
                </Button>
                &nbsp;
                <Button onClick={onRemove}>
                    <IoMdClose /> Remove
                </Button>
                &nbsp;
                <Form.Check
                    checked={layer.showStops}
                    onChange={e => onShowStopsToggle(layer, e.currentTarget.checked)}
                    label="Show stops"
                />
                <Form.Check
                    checked={layer.showTrackings}
                    onChange={e => onShowTrackingsToggle(layer, e.currentTarget.checked)}
                    label="Show trackings"
                />
                <Slider
                    allowCross={false}
                    max={layer.trackings.length - 1}
                    min={0}
                    onChange={c => onChange(c[0], c[1])}
                    range
                    step={1}
                    value={[startIndex, endIndex]}
                />
                <MarkerControl
                    nextExists={endIndex - startIndex > 1}
                    previousExists={startIndex > 0}
                    timezone={timezone}
                    tracking={layer.startTracking}
                    onNext={() => onChange(startIndex + 1, endIndex)}
                    onPrevious={() => onChange(startIndex - 1, endIndex)}
                    onStep={(direction: RewindDirection) => onStep(MarkerType.Start, direction)}
                />
                <div className="pull-right">
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
                <div>
                    <BiStopwatch title="Time between trackings" />
                    &nbsp;{moment.duration(moment(layer.endTracking.timestamp).diff(moment(layer.startTracking.timestamp))).format()}
                </div>
                <div>
                    <ImRoad />
                    &nbsp;{distanceFormatted}
                </div>
                <div>
                    <RiPinDistanceFill />
                    &nbsp;{distanceBetweenMarkersFormatted}
                </div>
                <div>
                    <FaHashtag />
                    {layer.trackings.length}
                </div>
            </Card.Body>
        </Card>
    );

};

export default PolylineLayer;