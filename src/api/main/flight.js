import * as api from '../config';

export function getCountByAirport() {
    return api.get(`flight/count/byairport`);
}

export function getFlights() {
    return api.get(`flight`);
}