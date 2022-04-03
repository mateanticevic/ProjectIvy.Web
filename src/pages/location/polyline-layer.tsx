import React from 'react';
import { Button, ButtonGroup, Card, ToggleButton } from 'react-bootstrap';
import { Range } from 'rc-slider';
import moment from 'moment';
import { AiOutlineScissor } from 'react-icons/ai';
import { MdLocationOn } from 'react-icons/md';
import { BiStopwatch } from 'react-icons/bi';

import { components } from 'types/ivy-types';
import MarkerControl from './marker-control';
import { PolygonLayer } from 'models/layers';

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

    return (
        <Card>
            <Card.Body>
                <Button onClick={onClip}>
                    <AiOutlineScissor /> Clip
                </Button>
                &nbsp;
                <ButtonGroup size="sm">
                    <ToggleButton
                        id="toggle-points"
                        type="checkbox"
                        variant="primary"
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
                        id="toggle-stops"
                        type="checkbox"
                        variant="primary"
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
                    {moment(layer.endTracking.timestamp).diff(moment(layer.startTracking.timestamp), 'minutes')}m
                </div>
            </Card.Body>
        </Card>
    );

};

export default PolylineLayer;