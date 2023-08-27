import { components } from 'types/ivy-types';
import * as api from '../config';

type TrackingBinding = components['schemas']['TrackingBinding'];

const del = (timestamp: string) => api.del(`tracking/${timestamp}`);

function get(filters) {
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

const post = (tracking: TrackingBinding) => api.put('tracking', tracking);

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
