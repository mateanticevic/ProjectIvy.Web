import { browserHistory } from 'react-router';
import * as types from '../constants/loginActionTypes';
import * as tokenApi from '../api/main/token';
import * as apiConfig from '../api/config';

export function changedCredentials(credentials) {
  return {type: types.CHANGED_CREDENTIALS, credentials};
}

export function loginFail() {
    return {type: types.LOGIN_FAIL};
}

export function loginTry(credentials) {
  return function (dispatch) {
      return tokenApi.post(credentials).then(token => {
          localStorage.setItem("token", token);
          apiConfig.setToken(token);
          dispatch(loginSuccess());
      });
  };
}

export function loginSuccess() {
    browserHistory.push("/");
    return {type: types.LOGIN_SUCCESS};
}