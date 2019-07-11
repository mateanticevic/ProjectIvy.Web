import * as types from '../constants/loginActionTypes';
import initialState from './initialState';

export default function loginReducer(s = initialState.login, action) {

  switch (action.type) {

    case types.CHANGED_CREDENTIALS:
      return { ...s, credentials: action.credentials };

    case types.LOGIN_TRY:
      return { ...s, filters: action.filters };

    default:
      return s;
  }
}
