import * as webApi from '../api/main/web';
import * as types from '../constants/dashboardActionTypes';


export function getOnineData(filters) {
    return function (dispatch) {
        return webApi.getTimeTotalByDay(filters).then(json => { dispatch(getOnineDataSuccess(json)); });
    };
}

export function getOnineDataSuccess(data) {
    return { type: types.GET_ONLINE_DATA_SUCCESS, data };
}