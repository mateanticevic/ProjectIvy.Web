import * as api from '../config';

export function getCountByAirport(filters) {
    return api.get(`flight/count/byairport`, filters);
}

export function getFlights(filters) {
    return api.get(`flight`, filters);
}