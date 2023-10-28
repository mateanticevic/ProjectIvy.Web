import * as api from '../config';

const get = () => api.get('location');

const location = {
    get,
};

export default location;
