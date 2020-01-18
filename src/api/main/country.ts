import * as api from '../config';

function getAll() {
    return api.get('country?pageAll=true');
}

function getVisited(filters) {
    return api.get('country/visited', filters);
}

function getVisitedBoundaries() {
    return api.get('country/visited/boundaries');
}

const country = {
    getAll,
    getVisited,
    getVisitedBoundaries,
};

export default country;
