import moment from 'moment';
import React from 'react';
import { Button } from 'react-bootstrap';
import { MdSkipPrevious, MdSkipNext } from 'react-icons/md';

import { components } from 'types/ivy-types';

type Tracking = components['schemas']['Tracking'];

interface Props {
    nextExists: boolean;
    previousExists: boolean;
    tracking: Tracking;
    onNext(): void;
    onPrevious(): void;
}

const MarkerControl = ({ tracking, onNext, onPrevious, previousExists, nextExists }: Props) => {

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
            {moment(tracking.timestamp).format('MMM DD hh:mm:ss.SSS')}
        </React.Fragment>
    );
};

export default MarkerControl;