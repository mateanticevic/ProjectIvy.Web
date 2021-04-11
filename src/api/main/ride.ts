import * as api from '../config';

const get = (filters) => api.get('ride', filters);

const post = (ride) => api.post('ride', ride);

const ride = {
    get,
    post,
};

export default ride;
