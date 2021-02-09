import { IncomeFilters } from 'types/incomes';
import * as api from '../config';

const get = (filters: IncomeFilters) => api.get('income', filters);

const income = {
    get,
};

export default income;