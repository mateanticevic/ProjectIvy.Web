import { IncomeFilters } from 'types/incomes';
import { components } from 'types/ivy-types';

type IncomeBinding = components['schemas']['IncomeBinding'];

import * as api from '../config';

const get = (filters: IncomeFilters) => api.get('income', filters);

const getSources = () => api.get('income/source');

const getSum = (filters: IncomeFilters) => api.get('income/sum', filters);

const getSumByYear = (filters: IncomeFilters) => api.get('income/sum/byyear', filters);

const getSumByMonthOfYear = (filters: IncomeFilters) => api.get('income/sum/bymonthofyear', filters);

const post = (binding: IncomeBinding) => api.post('income', binding);

const income = {
    get,
    getSources,
    getSum,
    getSumByMonthOfYear,
    getSumByYear,
    post,
};

export default income;