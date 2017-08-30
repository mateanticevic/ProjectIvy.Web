import * as api from '../config';

export function get(filters) {
    return api.get("trip", filters);
}

export function getById(tripId) {
    return api.get(`trip/${tripId}`);
}