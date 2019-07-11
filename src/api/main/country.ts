import * as api from '../config';

export function getVisitedBoundaries() {
    return api.get("country/visited/boundaries");
}