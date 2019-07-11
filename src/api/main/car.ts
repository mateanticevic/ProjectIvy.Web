import * as api from '../config';

export function getLogLatest(carId) {
    return api.get(`car/${carId}/log/latest?hasOdometer=true`);
}

export function getLogBySession(carId, filters) {
    return api.get(`car/${carId}/log/bySession`, filters);
}