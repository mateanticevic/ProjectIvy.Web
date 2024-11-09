import moment from 'moment';
import React from 'react';
import { Button } from 'react-bootstrap';
import mtz from 'moment-timezone';
import { FaBackward, FaForward, FaStepBackward, FaStepForward } from 'react-icons/fa';

import { components } from 'types/ivy-types';
import { MarkerType } from './polyline-layer';
import { RewindDirection } from './polyline-layer';

type Tracking = components['schemas']['Tracking'];

interface Props {
    nextExists: boolean;
    previousExists: boolean;
    timezone?: string;
    tracking: Tracking;
    onNext(): void;
    onStep(direction: RewindDirection): void;
    onPrevious(): void;
}

const MarkerControl = ({ timezone, tracking, onNext, onPrevious, onStep, previousExists, nextExists }: Props) => {

    const speed = tracking.speed ? Math.round(tracking.speed * 3.6) : null;
    const timestamp = timezone ? mtz.utc(tracking.timestamp).tz(timezone) : moment(tracking.timestamp);

    return (
        <React.Fragment>
            <Button
                disabled={!previousExists}
                size="sm"
                title="Previous"
                onClick={() => onStep(RewindDirection.Reverse)}
            >
                <FaStepBackward />
            </Button>
            <Button
                disabled={!previousExists}
                size="sm"
                title="Previous"
                onClick={onPrevious}
            >
                <FaBackward />
            </Button>
            &nbsp;
            <Button
                disabled={!nextExists}
                size="sm"
                title="Next"
                onClick={onNext}
            >
                <FaForward />
            </Button>
            <Button
                disabled={!nextExists}
                size="sm"
                title="Next"
                onClick={() => onStep(RewindDirection.Forward)}
            >
                <FaStepForward />
            </Button>
            &nbsp;
            {timestamp.format('MMM DD HH:mm:ss.SSS')} | {speed ? `${speed} km/h` : 'n/a'} | {Math.round(tracking.altitude)}m
        </React.Fragment>
    );
};

export default MarkerControl;