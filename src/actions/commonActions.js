import * as types from '../constants/commonActionTypes';
import * as commonApi from '../api/main/common';
import * as vendorApi from '../api/main/vendor';

export function getExpenseFileTypes() {
  
    return function (dispatch) {
      return commonApi.getExpenseFileTypes().then(json => { dispatch(getExpenseFileTypesSuccess(json)); } );
    };
}
  
export function getExpenseFileTypesSuccess(expenseFileTypes) {
  return {type: types.GET_EXPENSE_FILE_TYPES_SUCCESS, expenseFileTypes};
}

export function getPoiCategories() {

  return function (dispatch) {
    return commonApi.getPoiCategories().then(json => { dispatch(getPoiCategoriesSuccess(json)); } );
  };
}

export function getPoiCategoriesSuccess(poiCategories) {
  return {type: types.GET_POI_CATEGORIES_SUCCESS, poiCategories};
}

export function getVendors() {
  return function (dispatch) {
    return vendorApi.get().then(json => { dispatch(getVendorsSuccess(json)); } );
  };
}

export function getVendorsSuccess(vendors) {
  return {type: types.GET_VENDORS_SUCCESS, vendors};
}