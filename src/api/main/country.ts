import * as api from '../config';

function getAll() {
    return api.get('country?pageAll=true');
}

function getVisitedBoundaries() {
    return api.get('country/visited/boundaries');
}

const country = {
    getAll,
    getVisitedBoundaries,
};

export default country;
