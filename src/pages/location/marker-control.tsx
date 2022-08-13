import moment from 'moment';
import React from 'react';
import { Button } from 'react-bootstrap';
import { MdSkipPrevious, MdSkipNext } from 'react-icons/md';
import mtz from 'moment-timezone';

import { components } from 'types/ivy-types';

type Tracking = components['schemas']['Tracking'];

interface Props {
    nextExists: boolean;
    previousExists: boolean;
    timezone?: string;
    tracking: Tracking;
    onNext(): void;
    onPrevious(): void;
}

const MarkerControl = ({ timezone, tracking, onNext, onPrevious, previousExists, nextExists }: Props) => {

    const speed = tracking.speed ? Math.round(tracking.speed * 3.6) : null;
    const timestamp = timezone ? mtz.utc(tracking.timestamp).tz(timezone) : moment(tracking.timestamp);

    return (
        <React.Fragment>
            <Button
                disabled={!previousExists}
                size="sm"
                title="Previous"
                onClick={onPrevious}
            >
                <MdSkipPrevious />
            </Button>
            &nbsp;
            <Button
                disabled={!nextExists}
                size="sm"
                title="Next"
                onClick={onNext}
            >
                <MdSkipNext />
            </Button>
            &nbsp;
            {timestamp.format('MMM DD HH:mm:ss.SSS')} | {speed ? `${speed} km/h` : 'n/a'} | {Math.round(tracking.altitude)}m
        </React.Fragment>
    );
};

export default MarkerControl;