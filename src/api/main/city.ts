import * as api from '../config';

function get(filter) {
    return api.get('city', filter);
}

const getVisited = () => api.get('city/visited');

const postGeohashes = (cityId: string, geohashes: string[]) => api.post(`city/${cityId}/geohash`, geohashes);

const postVisited = (cityId: string) => api.post(`city/visited/${cityId}`);

const city = {
    get,
    getVisited,
    postGeohashes,
    postVisited,
};

export default city;
