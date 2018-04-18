import moment from 'moment';
import * as carApi from '../api/main/car';
import * as expenseApi from '../api/main/expense';
import * as webApi from '../api/main/web';
import * as consumationApi from '../api/main/consumation';
import * as movieApi from '../api/main/movie';
import * as trackingApi from '../api/main/tracking';
import * as types from '../constants/dashboardActionTypes';

export function getExpenseSumThisMonth() {

    var filters = {
        from: moment().date(1).format("YYYY-MM-DD")
    };

    return function (dispatch) {
        return expenseApi.getSum(filters).then(json => { dispatch(getExpenseSumThisMonthSuccess(json)); });
    };
}

export function getExpenseSumThisMonthSuccess(data) {
    return { type: types.GET_EXPENSE_SUM_THIS_MONTH_SUCCESS, data };
}

export function getExpenseSumToday() {

    var filters = {
        from: moment().format("YYYY-MM-DD")
    };

    return function (dispatch) {
        return expenseApi.getSum(filters).then(json => { dispatch(getExpenseSumTodaySuccess(json)); });
    };
}

export function getExpenseSumTodaySuccess(data) {
    return { type: types.GET_EXPENSE_SUM_TODAY_SUCCESS, data };
}

export function getExpenseSumThisWeek() {

    var filters = {
        from: moment().isoWeekday(1).format("YYYY-MM-DD")
    };

    return function (dispatch) {
        return expenseApi.getSum(filters).then(json => { dispatch(getExpenseSumThisWeekSuccess(json)); });
    };
}

export function getExpenseSumThisWeekSuccess(data) {
    return { type: types.GET_EXPENSE_SUM_THIS_WEEK_SUCCESS, data };
}

export function getCarLatestLog(filters) {
    return function (dispatch) {
        return carApi.getLogLatest(filters).then(json => { dispatch(getCarLatestLogSuccess(json)); });
    };
}

export function getCarLatestLogSuccess(data) {
    return { type: types.GET_CAR_LOG_LATEST_SUCCESS, data };
}

export function getExpenseSumByMonth(filters) {
    return function (dispatch) {
        return expenseApi.getSumByMonth(filters).then(json => { dispatch(getExpenseSumByMonthSuccess(json)); });
    };
}

export function getExpenseSumByMonthSuccess(data) {
    return { type: types.GET_EXPENSE_SUM_BY_MONTH_SUCCESS, data };
}

export function getExpenses() {
    return function (dispatch) {
        return expenseApi.get({ pageSize: 5 }).then(json => { dispatch(getExpensesSuccess(json)); });
    };
}

export function getExpensesSuccess(data) {
    return { type: types.GET_RECENT_EXPENSES_SUCCESS, data };
}

export function getOnineData() {

    var filters = { from: moment().subtract(1, 'month').format("YYYY-MM-DD") };

    return function (dispatch) {
        return webApi.getTimeTotalByDay(filters).then(json => { dispatch(getOnineDataSuccess(json)); });
    };
}

export function getOnineDataSuccess(data) {
    return { type: types.GET_ONLINE_DATA_SUCCESS, data };
}

export function getLastLocation() {
    return function (dispatch) {
        return trackingApi.getLast().then(json => { dispatch(getLastLocationSuccess(json)); });
    };
}

export function getLastLocationSuccess(data) {
    return { type: types.GET_LAST_LOCATION_SUCCESS, data };
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