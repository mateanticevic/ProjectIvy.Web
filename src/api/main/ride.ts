import * as api from '../config';

const post = (ride) => api.post('ride', ride);

const ride = {
    post,
};

export default ride;
