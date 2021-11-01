import * as api from '../config';
import { GeohashFilters } from 'types/geohash';

const get = (filters: GeohashFilters) => api.get('geohash', filters);

const geohash = {
    get
};

export default geohash;