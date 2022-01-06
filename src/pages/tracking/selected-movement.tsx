import React from 'react';
import { Card, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import _ from 'lodash';
import { Range } from 'rc-slider';
import moment from 'moment';
import { MdFastRewind, MdFastForward } from 'react-icons/md';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';

import { Movement, Segment } from './types';

interface Props {
    movement: Movement;
    onTrackingSelected(tracking): void;
}

const Segments = (movement: Movement) => {
    console.log('renDR');

    let previous = movement.trackings[0];
    const segments: Segment[] = [];
    let segment: Segment = {
        from: moment(previous.timestamp),
        trackings: [],
    };

    for (let i = 1; i < movement.trackings.length; i++) {

        const current = movement.trackings[i];

        if (moment(current.timestamp).diff(moment(previous.timestamp)) < 1000 * 60 * 10) {
            segment.trackings.push(current);
        }
        else {
            segment.to = moment(previous.timestamp);
            segments.push(segment);
            segment = {
                from: moment(current.timestamp),
                trackings: []
            };
            segment.trackings.push(current);
        }

        if (movement.trackings.length - 1 === i) {
            segment.to = moment(current.timestamp);
            segments.push(segment);
        }

        previous = current;
    }

    return (
        <React.Fragment>
            <ul>
                {segments.map(segment =>
                    <li>{`${segment.from.format('HH:mm')}-${segment.to.format('HH:mm')} (${segment.trackings.length})`}</li>
                )}
            </ul>
        </React.Fragment>
    );
};

const SelectedMovement = ({ movement, onTrackingSelected }: Props) => {
    const [index, setIndex] = React.useState(0);

    const onChange = (value: number) => {
        const newIndex = value < 0 ? 0 : value >= movement.trackings.length ? movement.trackings.length - 1 : value;
        setIndex(newIndex);
        onTrackingSelected(movement.trackings[newIndex]);
    };

    const currentTracking = movement.trackings[index];
    const previousTracking = index == 0 ? null : movement.trackings[index - 1];
    const previousLatLng = previousTracking ? new google.maps.LatLng(previousTracking.latitude, previousTracking.longitude) : null;
    const currentLatLng = new google.maps.LatLng(currentTracking.latitude, currentTracking.longitude);
    const distanceFromPrevious = previousLatLng ? google.maps.geometry.spherical.computeDistanceBetween(previousLatLng, currentLatLng) : null;

    const selectedTime = moment(movement.trackings[index].timestamp);

    return (
        <Card>
            <Card.Header>Selected movement</Card.Header>
            <Card.Body>
                {`${selectedTime.format('HH:mm:ss.SSS')} - ${movement.trackings[index].speed * 3.6}km/h - from previous: ${distanceFromPrevious}m`}
                <Range
                    max={movement.trackings.length - 1}
                    min={0}
                    onChange={c => onChange(c[0])}
                    step={1}
                    value={[index]}
                />
                <ToggleButtonGroup name="manual-offset" type="radio" value={0} onChange={value => onChange(parseInt(value) + index)}>
                    <ToggleButton id="tracking-rew-10" value={-10}><MdFastRewind /></ToggleButton>
                    <ToggleButton id="tracking-rew-1" value={-1}><GrFormPrevious /></ToggleButton>
                    <ToggleButton id="tracking-fwd-1" value={1}><GrFormNext /></ToggleButton>
                    <ToggleButton id="tracking-fwd-10" value={10}><MdFastForward /></ToggleButton>
                </ToggleButtonGroup>
                {React.useMemo(() => Segments(movement), [movement])}
            </Card.Body>
        </Card>
    );
};

export default SelectedMovement;