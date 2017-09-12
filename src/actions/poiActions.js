import * as types from '../constants/poiActionTypes';
import * as poiApi from '../api/main/poi';

export function getPois(filters) {
  return function (dispatch) {
    return poiApi.get(filters).then(json => { dispatch(getPoisSuccess(json)); } );
  };
}

export function getPoisSuccess(pois) {
  return {type: types.GET_POIS_SUCCESS, pois};
}