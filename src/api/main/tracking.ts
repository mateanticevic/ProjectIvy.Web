import * as api from '../config';

function get(filters) {
    return api.get("tracking", filters);
}

function getDistance(filters) {
    return api.get("tracking/distance", filters);
}

function getLast(filters) {
    return api.get("tracking/last", filters);
}

const tracking = {
    get,
    getDistance,
    getLast
}

export default tracking;
