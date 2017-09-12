import * as types from '../constants/commonActionTypes';
import * as commonApi from '../api/main/common';

export function getPoiCategories() {

  return function (dispatch) {
    return commonApi.getPoiCategories().then(json => { dispatch(getPoiCategoriesSuccess(json)); } );
  };
}

export function getPoiCategoriesSuccess(poiCategories) {
  return {type: types.GET_POI_CATEGORIES_SUCCESS, poiCategories};
}
