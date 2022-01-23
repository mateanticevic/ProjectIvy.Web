import * as api from '../config';
import { GeohashFilters } from 'types/geohash';

const get = (filters: GeohashFilters) => api.get('geohash', filters);

const getSingle = (id: string) => api.get(`geohash/${id}`);

const geohash = {
    get,
    getSingle,
};

export default geohash;