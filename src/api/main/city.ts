import * as api from '../config';

const get = (filter) => api.get('city', filter);

const getGeohashes = (cityId: string) => api.get(`city/${cityId}/geohash`);

const getVisited = () => api.get('city/visited');

const postGeohashes = (cityId: string, geohashes: string[]) => api.post(`city/${cityId}/geohash`, geohashes);

const postVisited = (cityId: string) => api.post(`city/visited/${cityId}`);

const city = {
    get,
    getGeohashes,
    getVisited,
    postGeohashes,
    postVisited,
};

export default city;
