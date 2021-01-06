import * as api from '../config';

function get(filters) {
    return api.get('tracking', filters);
}

function getDays(filters) {
    return api.get('tracking/day', filters);
}

function getDistance(filters) {
    return api.get('tracking/distance', filters);
}

const getLastLocation = () => api.get('tracking/lastLocation');

interface LastParameters {
    at?: string;
}

function getLast(filters?: LastParameters) {
    return api.get('tracking/last', filters);
}

const tracking = {
    get,
    getDays,
    getDistance,
    getLast,
    getLastLocation,
};

export default tracking;
