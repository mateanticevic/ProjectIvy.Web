import * as expenseApi from '../api/main/expense';
import * as webApi from '../api/main/web';
import * as consumationApi from '../api/main/consumation';
import * as movieApi from '../api/main/movie';
import * as types from '../constants/dashboardActionTypes';


export function getExpenseSumByMonth(filters) {
    return function (dispatch) {
        return expenseApi.getSumByMonth(filters).then(json => { dispatch(getExpenseSumByMonthSuccess(json)); });
    };
}

export function getExpenseSumByMonthSuccess(data) {
    return { type: types.GET_EXPENSE_SUM_BY_MONTH_SUCCESS, data };
}

export function getOnineData(filters) {
    return function (dispatch) {
        return webApi.getTimeTotalByDay(filters).then(json => { dispatch(getOnineDataSuccess(json)); });
    };
}

export function getOnineDataSuccess(data) {
    return { type: types.GET_ONLINE_DATA_SUCCESS, data };
}

export function getMovies(filters) {
    return function (dispatch) {
        return movieApi.get(filters).then(json => { dispatch(getMoviesSuccess(json)); });
    };
}

export function getMoviesSuccess(data) {
    return { type: types.GET_MOVIES_SUCCESS, data };
}

export function getConsumations(filters) {
    return function (dispatch) {
        return consumationApi.get(filters).then(json => { dispatch(getConsumationsSuccess(json)); });
    };
}

export function getConsumationsSuccess(data) {
    return { type: types.GET_CONSUMATIONS_SUCCESS, data };
}