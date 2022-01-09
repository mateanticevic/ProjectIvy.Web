import moment from 'moment';
import React from 'react';
import { components } from 'types/ivy-types';

type Tracking = components['schemas']['Tracking'];

interface Props {
    tracking: Tracking;
}

const MarkerControl = ({ tracking }: Props) => {

    return (
        <React.Fragment>
            {moment(tracking.timestamp).format('MM-DD hh:mm:ss.SSS')}
        </React.Fragment>
    );
};

export default MarkerControl;