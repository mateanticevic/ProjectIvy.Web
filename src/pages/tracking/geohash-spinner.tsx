import React, { useSyncExternalStore } from 'react';
import { Spinner } from 'react-bootstrap';

import { getPendingGeohashRequests, subscribeGeohashRequests } from 'api/main/geohash';

const GeohashSpinner = () => {
    const pendingRequests = useSyncExternalStore(subscribeGeohashRequests, getPendingGeohashRequests);

    return pendingRequests > 0
        ? <Spinner className="ms-auto" animation="border" size="sm" role="status" aria-label="Loading geohashes" />
        : null;
};

export default GeohashSpinner;
