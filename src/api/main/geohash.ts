import * as api from '../config';
import { GeohashFilters } from 'types/geohash';

const delTrackings = (id: string) => api.del(`geohash/${id}/trackings`);

const get = (filters: GeohashFilters) => api.get('geohash', filters);

const getChildren = (geohash: string) => api.get(`geohash/${geohash}/children`);

const getSingle = (id: string) => api.get(`geohash/${id}`);

const geohash = {
    delTrackings,
    get,
    getChildren,
    getSingle,
};

export default geohash;