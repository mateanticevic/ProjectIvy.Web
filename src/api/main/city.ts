import { paths } from 'types/ivy-types';

import * as api from '../config';

type DeleteGeohashQuery = paths['/Country/{countryId}/Geohash']['delete']['parameters']['query'];
type GetCityGeohashVisitedQuery = paths['/City/{cityId}/Geohash/Visited']['get']['parameters']['query'];

const deleteGeohashes = (cityId: string, query: DeleteGeohashQuery) => api.del(`city/${cityId}/geohash`, query);

const get = (filter) => api.get('city', filter);

const getDays = (cityId: string, filter) => api.get(`city/${cityId}/days`, filter) as Promise<string[]>;

const getGeohashes = (cityId: string) => api.get(`city/${cityId}/geohash`);

const getGeohashesVisited = (cityId: string, query: GetCityGeohashVisitedQuery) => api.get(`city/${cityId}/geohash/visited`, query);

const getVisited = () => api.get('city/visited');

const postGeohashes = (cityId: string, geohashes: string[]) => api.post(`city/${cityId}/geohash`, geohashes);

const postVisited = (cityId: string) => api.post(`city/visited/${cityId}`);

const city = {
    deleteGeohashes,
    get,
    getDays,
    getGeohashes,
    getGeohashesVisited,
    getVisited,
    postGeohashes,
    postVisited,
};

export default city;
