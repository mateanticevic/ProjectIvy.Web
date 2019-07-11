import * as types from '../constants/poiActionTypes';
import initialState from './initialState';

export default function poisReducer(s = initialState.pois, action) {

  switch (action.type) {

    case types.GET_POIS_SUCCESS:
      return {...s, pois: action.pois};

    default:
      return s;
  }
}
