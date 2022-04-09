import React from 'react';
import { Button, ButtonGroup, Card, ToggleButton } from 'react-bootstrap';
import { Range } from 'rc-slider';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { AiOutlineScissor } from 'react-icons/ai';
import { MdLocationOn } from 'react-icons/md';
import { BiStopwatch } from 'react-icons/bi';
import { ImRoad } from 'react-icons/im';
import { RiPinDistanceFill } from 'react-icons/ri';

import { components } from 'types/ivy-types';
import MarkerControl from './marker-control';
import { PolygonLayer } from 'models/layers';
import { trackingToLatLng } from 'utils/gmap-helper';

momentDurationFormatSetup(moment);

type Tracking = components['schemas']['Tracking'];

interface Props {
    layer: PolygonLayer,
    onClip(): void,
    onEndMarkerMoved(tracking: Tracking): void,
    onStartMarkerMoved(tracking: Tracking): void,
    onShowPointsToggle(layer: PolygonLayer, show: boolean): void,
    onShowStopsToggle(layer: PolygonLayer, show: boolean): void,
}

const PolylineLayer = ({ layer, onClip, onEndMarkerMoved, onShowPointsToggle, onShowStopsToggle, onStartMarkerMoved }: Props) => {

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

    const getDistanceBetweenTrackings = (from: number, to: number) => {
        let distance = 0;
        for (let i = from; i < to - 1; i++) {
            const a = trackingToLatLng(layer.trackings[i]);
            const b = trackingToLatLng(layer.trackings[i + 1]);
            distance += google.maps.geometry.spherical.computeDistanceBetween(a, b);
        }
        return distance;
    }

    const distance = getDistanceBetweenTrackings(0, layer.trackings.length);
    const distanceFormatted = distance > 1000 ? `${Math.round(distance / 1000)}km` : `${Math.round(distance)}m`;

    const distanceBetweenMarkers = getDistanceBetweenTrackings(startIndex, endIndex);
    const distanceBetweenMarkersFormatted = distanceBetweenMarkers > 1000 ? `${Math.round(distanceBetweenMarkers / 1000)}km` : `${Math.round(distanceBetweenMarkers)}m`;

    return (
        <Card>
            <Card.Body>
                <Button onClick={onClip}>
                    <AiOutlineScissor /> Clip
                </Button>
                &nbsp;
                <ButtonGroup size="sm">
                    <ToggleButton
                        id={`toggle-points-${layer.id}`}
                        type="checkbox"
                        variant="secondary"
                        checked={layer.showPoints}
                        value="1"
                        onChange={e => onShowPointsToggle(layer, e.currentTarget.checked)}
                    >
                        <MdLocationOn /> Points
                    </ToggleButton>
                </ButtonGroup>
                &nbsp;
                <ButtonGroup size="sm">
                    <ToggleButton
                        id={`toggle-stops-${layer.id}`}
                        type="checkbox"
                        variant="secondary"
                        checked={layer.showStops}
                        value="2"
                        onChange={e => onShowStopsToggle(layer, e.currentTarget.checked)}
                    >
                        <BiStopwatch /> Stops
                    </ToggleButton>
                </ButtonGroup>
                <Range
                    max={layer.trackings.length - 1}
                    min={0}
                    onChange={c => onChange(c[0], c[1])}
                    step={1}
                    value={[startIndex, endIndex]}
                />
                <MarkerControl
                    nextExists={endIndex - startIndex > 1}
                    previousExists={startIndex > 0}
                    tracking={layer.startTracking}
                    onNext={() => onChange(startIndex + 1, endIndex)}
                    onPrevious={() => onChange(startIndex - 1, endIndex)}
                />
                <div className="pull-right">
                    <MarkerControl
                        nextExists={layer.trackings.length > endIndex + 1}
                        previousExists={endIndex - startIndex > 1}
                        tracking={layer.endTracking}
                        onNext={() => onChange(startIndex, endIndex + 1)}
                        onPrevious={() => onChange(startIndex, endIndex - 1)}
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
            </Card.Body>
        </Card>
    );

};

export default PolylineLayer;