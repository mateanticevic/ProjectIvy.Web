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

function getLast(filters) {
    return api.get('tracking/last', filters);
}

const tracking = {
    get,
    getDays,
    getDistance,
    getLast,
};

export default tracking;
