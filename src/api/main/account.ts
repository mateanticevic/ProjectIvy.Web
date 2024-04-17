import * as api from '../config';

const get = (filters?) => api.get('account', filters);

const getTransactions = (accountId: string, filters?) => api.get(`account/${accountId}/transaction`, filters);

const account = {
    get,
    getTransactions,
};

export default account;