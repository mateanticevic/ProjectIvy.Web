import * as api from '../config';

import { paths, components } from 'types/ivy-types';

type CountriesByDay = components['schemas']['DateTimeStringIEnumerableKeyValuePair'];

type DeleteGeohashQuery = paths['/Country/{countryId}/Geohash']['delete']['parameters']['query'];

const deleteGeohashes = (countryId: string, query: DeleteGeohashQuery) => api.del(`country/${countryId}/geohash`, query);

const get = (filter) => api.get('country', filter);

const getAll = () => api.get('country?pageAll=true');

const getGeohashes = (countryId) => api.get(`country/${countryId}/geohash`);

const getListsVisited = () => api.get('country/list/visited');

const getSingle = (latitude: number, longitude: number) => api.get('country/single', { latitude, longitude });

const getVisited = (filters) => api.get('country/visited', filters);

const getVisitedBoundaries = () => api.get('country/visited/boundaries');

const getVisitedByDay = (filters) => api.get('country/visited/byday', filters) as Promise<CountriesByDay[]>;

const postGeohashes = (countryId: string, geohashes: string[]) => api.post(`country/${countryId}/geohash`, geohashes);

const country = {
    deleteGeohashes,
    get,
    getAll,
    getGeohashes,
    getListsVisited,
    getSingle,
    getVisited,
    getVisitedBoundaries,
    getVisitedByDay,
    postGeohashes,
};

export default country;
