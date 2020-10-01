import { CountryListVisited } from 'types/trips';
import * as api from '../config';

function getAll() {
    return api.get('country?pageAll=true');
}

const getListsVisited = () => api.get('country/list/visited');

function getVisited(filters) {
    return api.get('country/visited', filters);
}

function getVisitedBoundaries() {
    return api.get('country/visited/boundaries');
}

const country = {
    getAll,
    getListsVisited,
    getVisited,
    getVisitedBoundaries,
};

export default country;
