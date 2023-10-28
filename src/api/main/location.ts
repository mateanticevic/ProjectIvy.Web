import * as api from '../config';

const get = () => api.get('location');

const getDays = (locationId) => api.get(`location/${locationId}/days`);

const location = {
    get,
    getDays,
};

export default location;
