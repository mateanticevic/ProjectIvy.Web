import { CarLogFilters } from 'types/car';
import * as api from '../config';

const get = (carId: string) => api.get(`car/${carId}`);

const getAverageConsumption = (carId: string) => api.get(`car/${carId}/consumption/avg`);

const getFuelSumByYear = (carId: string) => api.get(`car/${carId}/fuel/sum/byyear`);

const getKilometersByYear = (carId: string) => api.get(`car/${carId}/kilometers/byyear`);

const getLogs = (carId: string, filters: CarLogFilters) => api.get(`car/${carId}/log`, filters);

const getLogLatest = (carId: string) => api.get(`car/${carId}/log/latest?hasOdometer=true`);

const getLogBySession = (carId: string, filters) => api.get(`car/${carId}/log/bySession`, filters);

const getServiceIntervals = (carModelId: string) => api.get(`carModel/${carModelId}/serviceInterval`);

const getServiceTypes = (carModelId: string) => api.get(`carModel/${carModelId}/serviceType`);

const postLog = (carId: string, carLog) => api.post(`car/${carId}/log`, carLog);

const postService = (carId: string, carService) => api.post(`car/${carId}/service`, carService);

const car = {
    get,
    getAverageConsumption,
    getFuelSumByYear,
    getKilometersByYear,
    getLogs,
    getLogLatest,
    getLogBySession,
    getServiceIntervals,
    getServiceTypes,
    postLog,
    postService,
};

export default car;
