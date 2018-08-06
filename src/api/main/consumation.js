import * as api from '../config';

export function get(filters) {
    return api.get("consumation", filters);
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