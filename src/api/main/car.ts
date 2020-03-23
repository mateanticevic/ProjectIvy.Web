import * as api from '../config';

const get = (carId: string) => api.get(`car/${carId}`);

const getLogLatest = (carId: string) => api.get(`car/${carId}/log/latest?hasOdometer=true`);

const getLogBySession = (carId: string, filters) => api.get(`car/${carId}/log/bySession`, filters);

const getServiceIntervals = (carModelId: string) => api.get(`carModel/${carModelId}/serviceInterval`);

const car = {
    get,
    getLogLatest,
    getLogBySession,
    getServiceIntervals,
};

export default car;
