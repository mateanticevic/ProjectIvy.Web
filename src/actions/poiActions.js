import * as types from '../constants/poiActionTypes';
import * as poiApi from '../api/main/poi';
import {toastr} from 'react-redux-toastr';

export function addPoi(poi) {
  return function (dispatch) {
    return poiApi.post(poi).then(e => {
      toastr.success('Success', 'Poi added.');
      dispatch(addPoiSuccess());
    });
  };
}

export function addPoiSuccess() {
  return {type: types.ADD_POI_SUCCESS};
}

export function getPois(filters) {
  return function (dispatch) {
    return poiApi.get(filters).then(json => { dispatch(getPoisSuccess(json)); } );
  };
}

export function getPoisSuccess(pois) {
  return {type: types.GET_POIS_SUCCESS, pois};
}