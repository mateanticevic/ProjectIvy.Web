import * as api from '../config';

import { components, paths } from 'types/ivy-types';

type DateTimeLocationIEnumerableKeyValuePair = components['schemas']['DateTimeLocationIEnumerableKeyValuePair'];
type DeleteGeohashQuery = paths['/Location/{locationId}/Geohash']['delete']['parameters']['query'];
type GetQuery = paths['/Location']['get']['parameters']['query'];
type LocationBinding = components['schemas']['LocationBinding'];
type LocationPagedView = components['schemas']['LocationPagedView'];
type LocationType = components['schemas']['LocationType'];

const deleteGeohashes = (locationId: string, query: DeleteGeohashQuery): Promise<number> => api.del(`location/${locationId}/geohash`, query);

const get = (filter?: GetQuery): Promise<LocationPagedView> => api.get('location', filter);

const getByDay = (from: string, to: string): Promise<DateTimeLocationIEnumerableKeyValuePair[]> => api.get('location/byday', { from, to });

const getGeohashes = (locationId: string): Promise<string[]> => api.get(`location/${locationId}/geohashes`);

const getDays = (locationId: string) => api.get(`location/${locationId}/days`);

const getTypes = (): Promise<LocationType[]> => api.get('location/types');

const post = (location: LocationBinding): Promise<number> => api.post('location', location);

const postGeohashes = (locationId: string, geohashes: string[]): Promise<number> => api.post(`location/${locationId}/geohash`, geohashes);

const location = {
    deleteGeohashes,
    get,
    getByDay,
    getGeohashes,
    getDays,
    getTypes,
    post,
    postGeohashes,
};

export default location;
