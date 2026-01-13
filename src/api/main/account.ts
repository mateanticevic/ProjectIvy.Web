import { components } from 'types/ivy-types';

import * as api from '../config';

type Transaction = components['schemas']['Transaction'];

const get = (filters?) => api.get('account', filters);

const getTransactions = (accountId: string, filters?) => api.get(`account/${accountId}/transaction`, filters);

const postTransaction = (accountId: string, data: Transaction) => api.post(`account/${accountId}/transaction`, data);

const post = (data) => api.post('account', data);

const account = {
    get,
    getTransactions,
    postTransaction,
    post,
};

export default account;