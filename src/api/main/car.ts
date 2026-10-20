import { CarLogFilters } from 'types/car';
import { CarFueling, CarFuelTotal } from 'types/car-fueling';
import { components, paths } from 'types/ivy-types';
import * as api from '../config';

type Car = components['schemas']['Car'];
type CarLog = components['schemas']['CarLog'];
type CarLogBinding = components['schemas']['CarLogBinding'];
type CarLogBySession = components['schemas']['CarLogBySession'];
type CarServiceBinding = components['schemas']['CarServiceBinding'];
type CarServiceInterval = components['schemas']['CarServiceInterval'];
type CarServiceType = components['schemas']['CarServiceType'];
type Int32Int32KeyValuePair = components['schemas']['Int32Int32KeyValuePair'];
type GetCarLogBySessionQuery = paths['/Car/{carId}/Log/BySession']['get']['parameters']['query'];

const get = (carId: string): Promise<Car> => api.get(`car/${carId}`);

const getAverageConsumption = (carId: string) => api.get(`car/${carId}/consumption/avg`);

const getFuelings = (carId: string): Promise<CarFueling[]> => api.get(`car/${carId}/fuel`);

const getFuelSumByMonth = (carId: string): Promise<CarFuelTotal[]> => api.get(`car/${carId}/fuel/sum/bymonth`);

const getFuelSumByYear = (carId: string): Promise<CarFuelTotal[]> => api.get(`car/${carId}/fuel/sum/byyear`);

const postFueling = (carId: string, fueling: components['schemas']['CarFuelingBinding']): Promise<number> => api.post(`car/${carId}/fuel`, fueling);

const getKilometersByYear = (carId: string): Promise<Int32Int32KeyValuePair[]> => api.get(`car/${carId}/kilometers/byyear`);

const getLogs = (carId: string, filters: CarLogFilters) => api.get(`car/${carId}/log`, filters);

const getLogLatest = (carId: string): Promise<CarLog> => api.get(`car/${carId}/log/latest?hasOdometer=true`);

const getLogBySession = (carId: string, filters?: GetCarLogBySessionQuery): Promise<CarLogBySession[]> => api.get(`car/${carId}/log/bySession`, filters);

const getServiceIntervals = (carModelId: string): Promise<CarServiceInterval[]> => api.get(`carModel/${carModelId}/serviceInterval`);

const getServiceTypes = (carModelId: string): Promise<CarServiceType[]> => api.get(`carModel/${carModelId}/serviceType`);

const postLog = (carId: string, carLog: CarLogBinding): Promise<string> => api.post(`car/${carId}/log`, carLog);

const postService = (carId: string, carService: CarServiceBinding): Promise<number> => api.post(`car/${carId}/service`, carService);

const car = {
    get,
    getAverageConsumption,
    getFuelings,
    getFuelSumByMonth,
    getFuelSumByYear,
    getKilometersByYear,
    getLogs,
    getLogLatest,
    getLogBySession,
    getServiceIntervals,
    getServiceTypes,
    postLog,
    postFueling,
    postService,
};

export default car;
