import { IncomeFilters } from 'types/incomes';
import { components } from 'types/ivy-types';

type IncomeBinding = components['schemas']['IncomeBinding'];

import * as api from '../config';

const toQuery = ({ linkedToSalary, ...filters }: IncomeFilters) => ({
    ...filters,
    ...(linkedToSalary === undefined ? {} : { LinkedToSalary: linkedToSalary }),
});

const get = (filters: IncomeFilters) => api.get('income', toQuery(filters));

const getSources = () => api.get('income/source');

const getSum = (filters: IncomeFilters) => api.get('income/sum', toQuery(filters));

const getSumByYear = (filters: IncomeFilters) => api.get('income/sum/byyear', toQuery(filters));

const getSumByMonthOfYear = (filters: IncomeFilters) => api.get('income/sum/bymonthofyear', toQuery(filters));

const post = (binding: IncomeBinding) => api.post('income', binding);

const put = async (id: string, binding: IncomeBinding): Promise<void> => {
    await api.put(`income/${encodeURIComponent(id)}`, binding);
};

const income = {
    get,
    getSources,
    getSum,
    getSumByMonthOfYear,
    getSumByYear,
    post,
    put,
};

export default income;
