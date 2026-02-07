import { components, paths } from 'types/ivy-types';
import * as api from '../config';

type Tracking = components['schemas']['Tracking'];
type TrackingBinding = components['schemas']['TrackingBinding'];
type GetTrackingQuery = paths['/Tracking']['get']['parameters']['query'];

const del = (timestamp: string): Promise<number> => api.del(`tracking/${timestamp}`);

function get(filters?: GetTrackingQuery): Promise<Tracking[]> {
    return api.get('tracking', filters);
}

function getDays(filters) {
    return api.get('tracking/day', filters);
}

function getDistance(filters) {
    return api.get('tracking/distance', filters);
}

const getLastLocation = () => api.get('tracking/lastLocation');

interface LastParameters {
    at?: string;
}

function getLast(filters?: LastParameters) {
    return api.get('tracking/last', filters);
}

const post = (tracking: TrackingBinding): Promise<number> => api.put('tracking', tracking);

const tracking = {
    del,
    get,
    getDays,
    getDistance,
    getLast,
    getLastLocation,
    post,
};

export default tracking;
