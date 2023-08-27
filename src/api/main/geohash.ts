import * as api from '../config';
import { GeohashFilters } from 'types/geohash';

const get = (filters: GeohashFilters) => api.get('geohash', filters);

const getChildren = (geohash: string) => api.get(`geohash/${geohash}/children`);

const getSingle = (id: string) => api.get(`geohash/${id}`);

const geohash = {
    get,
    getChildren,
    getSingle,
};

export default geohash;