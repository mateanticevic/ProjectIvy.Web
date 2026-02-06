import { components } from 'types/ivy-types';

import * as api from '../config';

type AccountBinding = components['schemas']['AccountBinding'];
type Transaction = components['schemas']['Transaction'];

const get = (filters?) => api.get('account', filters);

const getTransactions = (accountId: string, filters?) => api.get(`account/${accountId}/transaction`, filters);

const postTransaction = (accountId: string, data: Transaction) => api.post(`account/${accountId}/transaction`, data);

const post = (account: AccountBinding) => api.post('account', account);

const put = (accountId: string, account: AccountBinding) => api.put(`account/${accountId}`, account);

const account = {
    get,
    getTransactions,
    postTransaction,
    post,
    put,
};

export default account;