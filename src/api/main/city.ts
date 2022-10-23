import * as api from '../config';

function get(filter) {
    return api.get('city', filter);
}

const getVisited = () => api.get('city/visited');

const postVisited = (cityId: string) => api.post(`city/visited/${cityId}`);

const city = {
    get,
    getVisited,
    postVisited,
};

export default city;
