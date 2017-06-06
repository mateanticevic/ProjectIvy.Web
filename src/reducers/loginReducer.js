import * as types from '../constants/loginActionTypes';
import objectAssign from 'object-assign';
import initialState from './initialState';

export default function loginReducer(state = initialState.login, action) {

  switch (action.type) {

    case types.CHANGED_CREDENTIALS:
      return objectAssign({}, state, {credentials: action.credentials});

    case types.LOGIN_TRY:
      return objectAssign({}, state, {filters: action.filters});

    default:
      return state;
  }
}
