import * as api from '../config';

import { paths, components } from 'types/ivy-types';

type Country = components['schemas']['Country'];
type CountryPagedView = components['schemas']['CountryPagedView'];
type CountriesByDay = components['schemas']['DateTimeStringIEnumerableKeyValuePair'];
type DeleteGeohashQuery = paths['/Country/{countryId}/Geohash']['delete']['parameters']['query'];
type GetCountryQuery = paths['/Country']['get']['parameters']['query'];
type GetGeohashVisitedQuery = paths['/Country/{countryId}/Geohash/Visited']['get']['parameters']['query'];

const deleteGeohashes = (countryId: string, query: DeleteGeohashQuery): Promise<number> => api.del(`country/${countryId}/geohash`, query);

const get = (filter?: GetCountryQuery): Promise<CountryPagedView> => api.get('country', filter);

const getAll = (): Promise<Country[]> => api.get('country?pageAll=true');

const getGeohashes = (countryId) => api.get(`country/${countryId}/geohash`);

const getGeohashesVisited = (countryId: string, query: GetGeohashVisitedQuery) => api.get(`country/${countryId}/geohash/visited`, query);

const getListsVisited = () => api.get('country/list/visited');

const getSingle = (latitude: number, longitude: number) => api.get('country/single', { latitude, longitude });

const getVisited = (filters) => api.get('country/visited', filters);

const getVisitedBoundaries = () => api.get('country/visited/boundaries');

const getVisitedByDay = (filters) => api.get('country/visited/byday', filters) as Promise<CountriesByDay[]>;

const postGeohashes = (countryId: string, geohashes: string[]): Promise<number> => api.post(`country/${countryId}/geohash`, geohashes);

const country = {
    deleteGeohashes,
    get,
    getAll,
    getGeohashes,
    getGeohashesVisited,
    getListsVisited,
    getSingle,
    getVisited,
    getVisitedBoundaries,
    getVisitedByDay,
    postGeohashes,
};

export default country;
