import * as api from '../config';
import { components } from 'types/ivy-types';

type ExpenseTypeNode = components['schemas']['ExpenseTypeNode'];

const get = (filters) => api.get('expenseType', filters);

const getTree = () => api.get('expenseType/tree') as Promise<ExpenseTypeNode[]>;

const expenseType = {
    get,
    getTree,
};

export default expenseType;
