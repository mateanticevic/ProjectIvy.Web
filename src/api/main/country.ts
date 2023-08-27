import { CountryListVisited } from 'types/trips';
import * as api from '../config';

const getAll = () => api.get('country?pageAll=true');

const getListsVisited = () => api.get('country/list/visited');

const getSingle = (latitude: number, longitude: number) => api.get('country/single', { latitude, longitude });

const getVisited = (filters) => api.get('country/visited', filters);

const getVisitedBoundaries = () => api.get('country/visited/boundaries');

const country = {
    getAll,
    getListsVisited,
    getSingle,
    getVisited,
    getVisitedBoundaries,
};

export default country;
