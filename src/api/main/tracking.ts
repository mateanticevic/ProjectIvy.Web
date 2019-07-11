import * as api from '../config';

export function get(filters) {
    return api.get("tracking", filters);
}

export function getDistance(filters) {
    return api.get("tracking/distance", filters);
}

export function getLast(filters) {
    return api.get("tracking/last", filters);
}