import * as api from '../config';
import { components } from 'types/ivy-types';

type ExpenseTypeNode = components['schemas']['ExpenseTypeNode'];

type ExpenseTypeBinding = components['schemas']['ExpenseTypeBinding'];

const get = (filters) => api.get('expenseType', filters);

const getTree = () => api.get('expenseType/tree') as Promise<ExpenseTypeNode[]>;

const post = (data: ExpenseTypeBinding) => api.post('expenseType', data);

const postExpenseType = (parentId: string, childId: string) => api.post(`expenseType/${parentId}/expenseType/${childId}`);

const expenseType = {
    get,
    getTree,
    post,
    postExpenseType,
};

export default expenseType;
