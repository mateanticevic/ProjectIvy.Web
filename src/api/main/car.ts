import * as api from '../config';

function getLogLatest(carId) {
    return api.get(`car/${carId}/log/latest?hasOdometer=true`);
}

function getLogBySession(carId, filters) {
    return api.get(`car/${carId}/log/bySession`, filters);
}

const carApi = {
    getLogLatest,
    getLogBySession
};

export default carApi;