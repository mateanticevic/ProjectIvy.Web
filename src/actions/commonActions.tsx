import { Dispatch } from 'redux';

import * as types from '../constants/commonActionTypes';
import * as commonApi from '../api/main/common';
import * as vendorApi from '../api/main/vendor';
import { Vendor } from '../types/common';
import { PoiCategory } from '../types/pois';
import { ExpenseFileType } from '../types/expenses';

export function getExpenseFileTypes() {

  return function (dispatch: Dispatch) {
    return commonApi.getExpenseFileTypes().then(json => { dispatch(getExpenseFileTypesSuccess(json)); });
  };
}

export function getExpenseFileTypesSuccess(expenseFileTypes: ExpenseFileType[]) {
  return { type: types.GET_EXPENSE_FILE_TYPES_SUCCESS, expenseFileTypes };
}

export function getPoiCategories() {

  return function (dispatch: Dispatch) {
    return commonApi.getPoiCategories().then(json => { dispatch(getPoiCategoriesSuccess(json)); });
  };
}

export function getPoiCategoriesSuccess(poiCategories: PoiCategory[]) {
  return { type: types.GET_POI_CATEGORIES_SUCCESS, poiCategories };
}

export function getVendors() {
  return function (dispatch: Dispatch) {
    return vendorApi.get().then(json => { dispatch(getVendorsSuccess(json)); });
  };
}

export function getVendorsSuccess(vendors: Vendor[]) {
  return { type: types.GET_VENDORS_SUCCESS, vendors };
}