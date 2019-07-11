import initialState from './initialState';
import * as types from '../constants/dashboardActionTypes';

export default function dashboardReducer(s = initialState.dashboard, action) {

    switch (action.type) {

        case types.GET_EXPENSE_SUM_BY_MONTH_SUCCESS:
            return { ...s, spentByMonthGraphData: action.data };

        case types.GET_ONLINE_DATA_SUCCESS:
            return { ...s, onlineGraphData: action.data };

        case types.GET_LAST_LOCATION_SUCCESS:
            return { ...s, lastLocation: action.data };

        case types.GET_MOVIES_SUCCESS:
            return { ...s, movies: action.data.items };

        case types.GET_RECENT_EXPENSES_SUCCESS:
            return { ...s, expenses: action.data.items };

        case types.GET_RECENT_CONSUMATIONS_SUCCESS:
            return { ...s, consumations: action.data.items };

        case types.GET_CAR_LOG_LATEST_SUCCESS:
            return { ...s, carLogLatest: action.data.latestLog, carLogs: action.data.logs.slice(0, 3) };

        case types.GET_EXPENSE_SUM_THIS_MONTH_SUCCESS:
            return { ...s, spentThisMonth: action.data };

        case types.GET_EXPENSE_SUM_THIS_WEEK_SUCCESS:
            return { ...s, spentThisWeek: action.data };

        case types.GET_EXPENSE_SUM_TODAY_SUCCESS:
            return { ...s, spentToday: action.data };

        case types.GET_DISTANCE_TOTALS_SUCCESS:
            return { ...s, distance: action.data };

        default:
            return s;
    }
}
