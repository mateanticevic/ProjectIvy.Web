import * as api from '../config';

const get = (filters) => api.get('workday', filters);

const workDay = {
    get,
};

export default workDay;
