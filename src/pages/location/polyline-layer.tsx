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
}

const PolylineLayer = ({ layer, onClip, onEndMarkerMoved, onShowPointsToggle, onStartMarkerMoved }: Props) => {

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
                <Button size="sm" onClick={onClip}>
                    <AiOutlineScissor /> Clip
                </Button>
                <ButtonGroup size="sm">
                    <ToggleButton
                        id="toggle-check"
                        type="checkbox"
                        variant="secondary"
                        checked={layer.showPoints}
                        value="1"
                        onChange={e => onShowPointsToggle(layer, e.currentTarget.checked)}
                    >
                        <MdLocationOn /> Trackings
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
                    tracking={layer.startTracking}
                    onNext={() => onChange(startIndex + 1, endIndex)}
                    onPrevious={() => onChange(startIndex - 1, endIndex)}
                />
                <div className="pull-right">
                    <MarkerControl
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