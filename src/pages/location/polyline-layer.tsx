import React from 'react';
import { Button, ButtonGroup, Card, ToggleButton } from 'react-bootstrap';
import { Range } from 'rc-slider';
import { PolygonLayer } from 'models/layers';
import { Tracking } from 'pages/tracking/types';
import moment from 'moment';
import MarkerControl from './marker-control';

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
                <Button onClick={onClip}>Clip</Button>
                <ButtonGroup className="mb-2">
                    <ToggleButton
                        id="toggle-check"
                        type="checkbox"
                        variant="secondary"
                        checked={layer.showPoints}
                        value="1"
                        onChange={e => onShowPointsToggle(layer, e.currentTarget.checked)}
                    >
                        Points
                    </ToggleButton>
                </ButtonGroup>
                <Range
                    max={layer.trackings.length - 1}
                    min={0}
                    onChange={c => onChange(c[0], c[1])}
                    step={1}
                    value={[startIndex, endIndex]}
                />
                <MarkerControl tracking={layer.startTracking} />
                <MarkerControl tracking={layer.endTracking} />
                {moment(layer.endTracking.timestamp).diff(moment(layer.startTracking.timestamp), 'minutes')}
            </Card.Body>
        </Card>
    );

};

export default PolylineLayer;