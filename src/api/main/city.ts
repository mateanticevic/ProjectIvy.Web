import * as api from '../config';

function get(filter) {
    return api.get('city', filter);
}

const getVisited = () => api.get('city/visited');

const city = {
    get,
    getVisited,
};

export default city;
