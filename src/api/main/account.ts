import * as api from '../config';

const get = (filters?) => api.get('account', filters);

const getTransactions = (accountId: string, filters?) => api.get(`account/${accountId}/transaction`, filters);

const post = (data) => api.post('account', data);

const account = {
    get,
    getTransactions,
    post,
};

export default account;