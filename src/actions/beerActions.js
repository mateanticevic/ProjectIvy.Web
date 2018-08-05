import * as consumationApi from '../api/main/consumation';
import * as types from '../constants/beerActionTypes';

export function getConsumations(filter) {

    return function (dispatch) {
        return consumationApi.get(filter).then(json => { dispatch(getConsumationsSuccess(json)); });
    };
}

export function getConsumationsSuccess(data) {
    return { type: types.GET_CONSUMATIONS_SUCCESS, data };
}

export function getConsumationSum(filter) {

    return function (dispatch) {
        return consumationApi.getSum(filter).then(json => { dispatch(getConsumationSumSuccess(json)); });
    };
}

export function getConsumationSumSuccess(data) {
    return { type: types.GET_CONSUMATION_SUM_SUCCESS, data };
}