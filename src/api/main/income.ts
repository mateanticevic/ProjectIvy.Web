import { IncomeFilters } from 'types/incomes';
import * as api from '../config';

const get = (filters: IncomeFilters) => api.get('income', filters);

const getSources = () => api.get('income/source');

const getSumByYear = (filters: IncomeFilters) => api.get('income/sum/byyear', filters);

const income = {
    get,
    getSources,
    getSumByYear,
};

export default income;