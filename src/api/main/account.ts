import * as api from '../config';

const get = (filters?) => api.get('account', filters);

const account = {
    get
};

export default account;