import * as api from '../config';

function get(filters) {
    return api.get('consumation', filters);
}

function getCountBeer(filters) {
    return api.get('consumation/beer/count', filters);
}

function getCountByMonth(filters) {
    return api.get('consumation/count/bymonth', filters);
}

function getCountByMonthOfYear(filters) {
    return api.get('consumation/count/bymonthofyear', filters);
}

function getCountByYear(filters) {
    return api.get('consumation/count/byyear', filters);
}

function getCountBrand(filters) {
    return api.get('consumation/brand/count', filters);
}

function getNewBeers(filters) {
    return api.get('consumation/beer/new', filters);
}

function getSum(filters) {
    return api.get('consumation/sum', filters);
}

function getSumByBeer(filters) {
    return api.get('consumation/sum/byBeer', filters);
}

function getSumByServing(filters) {
    return api.get('consumation/sum/byServing', filters);
}

function post(consumation) {
    return api.post('consumation', consumation);
}

const consumation = {
    get,
    getCountBeer,
    getCountByMonth,
    getCountByMonthOfYear,
    getCountByYear,
    getCountBrand,
    getNewBeers,
    getSum,
    getSumByBeer,
    getSumByServing,
    post,
};

export default consumation;
