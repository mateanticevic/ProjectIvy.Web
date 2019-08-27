import * as api from '../config';

export function get(filters) {
    return api.get("consumation", filters);
}

export function getCountBeer(filters) {
    return api.get("consumation/beer/count", filters);
}

export function getCountBrand(filters) {
    return api.get("consumation/brand/count", filters);
}

export function getNewBeers(filters) {
    return api.get("consumation/beer/new", filters);
}

export function getSum(filters) {
    return api.get("consumation/sum", filters);
}

export function getSumByBeer(filters) {
    return api.get("consumation/sum/byBeer", filters);
}

export function getSumByServing(filters) {
    return api.get("consumation/sum/byServing", filters);
}

export function post(consumation) {
    return api.post("consumation", consumation);
}