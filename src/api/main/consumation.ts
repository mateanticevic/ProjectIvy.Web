import * as api from '../config';
import { components, paths } from 'types/ivy-types';

type ConsumationBinding = components['schemas']['ConsumationBinding'];
type ConsumationPagedView = components['schemas']['ConsumationPagedView'];
type GetConsumationQuery = paths['/Consumation']['get']['parameters']['query'];

const get = (filters?: GetConsumationQuery): Promise<ConsumationPagedView> => api.get('consumation', filters);

const getAlcoholByYear = (filters) => api.get('consumation/alcohol/byYear', filters);

const getCountBeer = (filters) => api.get('consumation/beer/count', filters);

const getCountByMonth = (filters) => api.get('consumation/count/bymonth', filters);

const getCountByMonthOfYear = (filters) => api.get('consumation/count/bymonthofyear', filters);

const getCountByYear = (filters) => api.get('consumation/count/byyear', filters);

const getCountBrand = (filters) => api.get('consumation/brand/count', filters);

const getNewBeers = (filters) => api.get('consumation/beer/new', filters);

const getSum = (filters) => api.get('consumation/sum', filters);

const getSumByBeer = (filters) => api.get('consumation/sum/byBeer', filters);

const getCountry = (filters) => api.get('consumation/country', filters);

const getCountryBoundaries = (filters) => api.get('consumation/country/boundaries', filters);

const getSumByCountry = (filters) => api.get('consumation/sum/byCountry', filters);

const getSumByDay = (filters) => api.get('consumation/sum/byDay', filters);

const getSumByDayOfWeek = (filters) => api.get('consumation/sum/byDayOfWeek', filters);

const getSumByMonthOfYear = (filters) => api.get('consumation/sum/byMonthOfYear', filters);

const getSumByYear = (filters) => api.get('consumation/sum/byYear', filters);

const getSumByServing = (filters) => api.get('consumation/sum/byServing', filters);

const post = (consumation: ConsumationBinding): Promise<number> => api.post('consumation', consumation);

const consumation = {
    get,
    getAlcoholByYear,
    getCountBeer,
    getCountByMonth,
    getCountByMonthOfYear,
    getCountByYear,
    getCountBrand,
    getCountry,
    getCountryBoundaries,
    getNewBeers,
    getSum,
    getSumByBeer,
    getSumByCountry,
    getSumByDay,
    getSumByDayOfWeek,
    getSumByMonth: (filters) => api.get('consumation/sum/byMonth', filters),
    getSumByMonthOfYear,
    getSumByYear,
    getSumByServing,
    post,
};

export default consumation;
