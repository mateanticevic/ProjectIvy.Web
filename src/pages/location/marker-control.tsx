import moment from 'moment';
import React from 'react';
import { Button } from 'react-bootstrap';
import { MdSkipPrevious, MdSkipNext } from 'react-icons/md';

import { components } from 'types/ivy-types';

type Tracking = components['schemas']['Tracking'];

interface Props {
    tracking: Tracking;
    onNext(): void;
    onPrevious(): void;
}

const MarkerControl = ({ tracking, onNext, onPrevious }: Props) => {

    return (
        <React.Fragment>
            <Button size="sm" title="Previous">
                <MdSkipPrevious onClick={onPrevious} />
            </Button>
            <Button size="sm" title="Next">
                <MdSkipNext onClick={onNext} />
            </Button>
            {moment(tracking.timestamp).format('MMM DD hh:mm:ss.SSS')}
        </React.Fragment>
    );
};

export default MarkerControl;