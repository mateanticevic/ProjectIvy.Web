import { IncomeFilters } from 'types/incomes';
import * as api from '../config';

const get = (filters: IncomeFilters) => api.get('income', filters);

const getSumByYear = (filters: IncomeFilters) => api.get('income/sum/byyear', filters);

const income = {
    get,
    getSumByYear,
};

export default income;