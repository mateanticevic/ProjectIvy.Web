import * as api from '../config';

import { components } from 'types/ivy-types';
import { paths } from 'types/ivy-types';

type DeleteGeohashQuery = paths['/Location/{locationId}/Geohashes']['delete']['parameters']['query'];
type GetQuery = paths['/Location']['get']['parameters']['query'];
type LocationBinding = components['schemas']['LocationBinding'];

const deleteGeohashes = (locationId: string, query: DeleteGeohashQuery) => api.del(`location/${locationId}/geohash`, query);

const get = (filter: GetQuery) => api.get('location', filter);

const getByDay = (from: string, to: string) => api.get('location/byday', { from, to });

const getGeohashes = (locationId) => api.get(`location/${locationId}/geohashes`);

const getDays = (locationId) => api.get(`location/${locationId}/days`);

const getTypes = () => api.get('location/types');

const post = (location: LocationBinding) => api.post('location', location);

const postGeohashes = (locationId: string, geohashes: string[]) => api.post(`location/${locationId}/geohash`, geohashes);

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
