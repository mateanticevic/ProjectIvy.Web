import * as api from '../config';
import { GeohashFilters } from 'types/geohash';
import { paths } from 'types/ivy-types';

type GetGeohashChildrenQuery = paths['/Geohash/{geohash}/Children']['get']['parameters']['query'];

const delTrackings = (id: string): Promise<number> => api.del(`geohash/${id}/trackings`);

const get = (filters: GeohashFilters) => api.get('geohash', filters);

const getChildren = (geohash: string, filters?: GetGeohashChildrenQuery) => api.get(`geohash/${geohash}/children`, filters);

const getSingle = (id: string) => api.get(`geohash/${id}`);

const geohash = {
    delTrackings,
    get,
    getChildren,
    getSingle,
};

export default geohash;