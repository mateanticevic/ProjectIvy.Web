import * as beerApi from '../api/main/beer';
import * as commonApi from '../api/main/common';
import * as consumationApi from '../api/main/consumation';
import * as types from '../constants/beerActionTypes';
import { toastr } from 'react-redux-toastr';

export function addConsumation(consumation, filters) {

    return function (dispatch) {
        return consumationApi.post(consumation).then(json => {
            toastr.success("Success", "New consumation added");
            dispatch(addConsumationSuccess(json));
            dispatch(getConsumations(filters));
        });
    };
}

export function addBeer(beer) {

    return function (dispatch) {
        return beerApi.postBeer(beer.brandId, beer).then(json => {
            toastr.success("Success", "New beer added");
        });
    };
}

export function addBrand(brand) {

    console.log(brand);

    return function (dispatch) {
        return beerApi.postBrand(brand.name).then(json => {
            toastr.success("Success", "New brand added");
            dispatch(getBrands());
        });
    };
}

export function addConsumationSuccess() {
    return { type: types.ADD_CONSUMATION_SUCCESS };
}

export function beerChange(beer) {
    return { type: types.BEER_CHANGE, beer };
}

export function brandChange(brand) {
    return { type: types.BRAND_CHANGE, brand };
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
        return beerApi.get({ brandId: brandId }).then(json => { dispatch(getConsumationBeersSuccess(json)); });
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

export function getConsumationSumByBeer(filter) {

    return function (dispatch) {
        return consumationApi.getSumByBeer(filter).then(json => { dispatch(getConsumationSumByBeerSuccess(json)); });
    };
}

export function getConsumationSumByBeerSuccess(data) {
    return { type: types.GET_CONSUMATION_SUM_BY_BEER_SUCCESS, data };
}

export function getServings() {

    return function (dispatch) {
        return commonApi.getBeerServing().then(json => { dispatch(getServingsSuccess(json)); });
    };
}

export function getServingsSuccess(data) {
    return { type: types.GET_SERVINGS_SUCCESS, data };
}