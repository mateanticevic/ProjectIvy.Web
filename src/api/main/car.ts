import { CarLogFilters } from 'types/car';
import * as api from '../config';

const get = (carId: string) => api.get(`car/${carId}`);

const getLogs = (carId: string, filters: CarLogFilters) => api.get(`car/${carId}/log`, filters);

const getLogLatest = (carId: string) => api.get(`car/${carId}/log/latest?hasOdometer=true`);

const getLogBySession = (carId: string, filters) => api.get(`car/${carId}/log/bySession`, filters);

const getServiceIntervals = (carModelId: string) => api.get(`carModel/${carModelId}/serviceInterval`);

const car = {
    get,
    getLogs,
    getLogLatest,
    getLogBySession,
    getServiceIntervals,
};

export default car;
