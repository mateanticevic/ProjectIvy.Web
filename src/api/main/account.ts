import { components, paths } from 'types/ivy-types';

import * as api from '../config';

type AccountPagedView = components['schemas']['AccountPagedView'];
type AccountBinding = components['schemas']['AccountBinding'];
type GetAccountQuery = paths['/Account']['get']['parameters']['query'];
type TransactionBinding = components['schemas']['TransactionBinding'];
type TransactionPagedView = components['schemas']['TransactionPagedView'];

const get = (filters: GetAccountQuery): Promise<AccountPagedView> => api.get('account', filters);

const getTransactions = (
    accountId: string,
    filters?: { PageAll?: boolean; Page?: number; PageSize?: number; From?: string; To?: string; OrderAscending?: boolean }
): Promise<TransactionPagedView> => api.get(`account/${accountId}/transaction`, filters);

const postTransaction = (accountId: string, data: TransactionBinding): Promise<number> => api.post(`account/${accountId}/transaction`, data);

const post = (account: AccountBinding): Promise<number> => api.post('account', account);

const put = (accountId: string, account: AccountBinding): Promise<number> => api.put(`account/${accountId}`, account);

const account = {
    get,
    getTransactions,
    postTransaction,
    post,
    put,
};

export default account;