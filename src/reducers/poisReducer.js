import * as types from '../constants/poiActionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';

export default function poisReducer(state = initialState.pois, action) {

  switch (action.type) {

    case types.GET_POIS_SUCCESS:
      return objectAssign({}, state, {pois: action.pois});

    default:
      return state;
  }
}
