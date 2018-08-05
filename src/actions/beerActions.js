import * as beerApi from '../api/main/beer';
import * as commonApi from '../api/main/common';
import * as consumationApi from '../api/main/consumation';
import * as types from '../constants/beerActionTypes';

export function addConsumation(consumation) {

    return function (dispatch) {
        return consumationApi.post(consumation).then(json => { dispatch(addConsumationSuccess(json)); });
    };
}

export function addConsumationSuccess() {
    return { type: types.ADD_CONSUMATION_SUCCESS };
}

export function consumationChange(consumation) {
    return { type: types.CONSUMATION_CHANGE, consumation };
  }

export function getBrands() {

    return function (dispatch) {
        return beerApi.getBrands().then(json => { dispatch(getBrandsSuccess(json)); });
    };
}

export function getBrandsSuccess(data) {
    return { type: types.GET_BRANDS_SUCCESS, data };
}

export function getConsumationBeers(brandId) {

    return function (dispatch) {
        return beerApi.get({brandId: brandId}).then(json => { dispatch(getConsumationBeersSuccess(json)); });
    };
}

export function getConsumationBeersSuccess(data) {
    return { type: types.GET_CONSUMATION_BEERS_SUCCESS, data };
}

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

export function getServings() {

    return function (dispatch) {
        return commonApi.getBeerServing().then(json => { dispatch(getServingsSuccess(json)); });
    };
}

export function getServingsSuccess(data) {
    return { type: types.GET_SERVINGS_SUCCESS, data };
}