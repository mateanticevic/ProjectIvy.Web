import * as api from '../config';

export function getLogLatest(car) {
    return api.get(`car/${car}/log/latest`);
}