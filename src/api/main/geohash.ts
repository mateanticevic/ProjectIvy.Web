import * as api from '../config';
import { GeohashFilters } from 'types/geohash';
import { paths } from 'types/ivy-types';

type GetGeohashChildrenQuery = paths['/Geohash/{geohash}/Children']['get']['parameters']['query'];
type GetUniqueGeohashQuery = paths['/Geohash/Unique']['get']['parameters']['query'];
type GetUniqueGeohashCountQuery = paths['/Geohash/Unique/Count']['get']['parameters']['query'];

let pendingRequests = 0;
const requestListeners = new Set<() => void>();

export const getPendingGeohashRequests = () => pendingRequests;

export const subscribeGeohashRequests = (listener: () => void) => {
    requestListeners.add(listener);
    return () => { requestListeners.delete(listener); };
};

const trackRequest = async <T>(request: () => Promise<T>): Promise<T> => {
    pendingRequests++;
    requestListeners.forEach(listener => listener());
    try {
        return await request();
    } finally {
        pendingRequests--;
        requestListeners.forEach(listener => listener());
    }
};

const delTrackings = (id: string): Promise<number> => trackRequest(() => api.del(`geohash/${id}/trackings`));

const get = (filters: GeohashFilters): Promise<string[]> => trackRequest(() => api.get('geohash', filters));

const getChildren = (geohash: string, filters?: GetGeohashChildrenQuery): Promise<string[]> => trackRequest(() => api.get(`geohash/${geohash}/children`, filters));

const getUnique = (filters?: GetUniqueGeohashQuery) => trackRequest(() => api.get('geohash/unique', filters));

const getUniqueCount = (filters?: GetUniqueGeohashCountQuery) => trackRequest(() => api.get('geohash/unique/count', filters));

const getSingle = (id: string) => trackRequest(() => api.get(`geohash/${id}`));

const geohash = {
    delTrackings,
    get,
    getChildren,
    getSingle,
    getUnique,
    getUniqueCount,
};

export default geohash;