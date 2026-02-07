import * as api from '../config';
import { components, paths } from 'types/ivy-types';

type ExpenseType = components['schemas']['ExpenseType'];
type ExpenseTypeNode = components['schemas']['ExpenseTypeNode'];
type ExpenseTypeBinding = components['schemas']['ExpenseTypeBinding'];
type GetExpenseTypeQuery = paths['/ExpenseType']['get']['parameters']['query'];

const get = (filters?: GetExpenseTypeQuery): Promise<ExpenseType[]> => api.get('expenseType', filters);

const getTree = () => api.get('expenseType/tree') as Promise<ExpenseTypeNode[]>;

const post = (data: ExpenseTypeBinding): Promise<number> => api.post('expenseType', data);

const postExpenseType = (parentId: string, childId: string): Promise<number> => api.post(`expenseType/${parentId}/expenseType/${childId}`);

const expenseType = {
    get,
    getTree,
    post,
    postExpenseType,
};

export default expenseType;
