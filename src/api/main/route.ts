import * as api from '../config';

const get = () => api.get('route');

const getPoints = (id: string) => api.get(`route/${id}/points`);

const route = {
    get,
    getPoints,
};

export default route;
