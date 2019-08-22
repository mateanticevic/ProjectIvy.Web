import * as api from '../config';

export function getAll() {
    return api.get("country?pageAll=true");
}

export function getVisitedBoundaries() {
    return api.get("country/visited/boundaries");
}