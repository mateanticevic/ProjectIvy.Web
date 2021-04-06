import * as api from '../config';

const get = (filters) => api.get('airport', filters); 

const airport = {
    get,
};

export default airport;