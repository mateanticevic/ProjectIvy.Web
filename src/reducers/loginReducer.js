import * as types from '../constants/loginActionTypes';
import initialState from './initialState';

export default function loginReducer(state = initialState.login, action) {

  switch (action.type) {

    case types.CHANGED_CREDENTIALS:
      return { ...state, credentials: action.credentials };

    case types.LOGIN_TRY:
      return { ...state, filters: action.filters };

    default:
      return state;
  }
}
