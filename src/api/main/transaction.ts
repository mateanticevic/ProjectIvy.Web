import { components, paths } from 'types/ivy-types';
import * as api from '../config';

type GetTransactionQuery = paths['/Transaction']['get']['parameters']['query'];
type TransactionWithAccountPagedView = components['schemas']['TransactionWithAccountPagedView'];

const get = (filters?: GetTransactionQuery): Promise<TransactionWithAccountPagedView> => api.get('transaction', filters);

export default { get };
