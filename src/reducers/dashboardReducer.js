import initialState from './initialState';
import * as types from '../constants/dashboardActionTypes';

export default function dashboardReducer(state = initialState.dashboard, action) {

    switch (action.type) {

        case types.GET_EXPENSE_SUM_BY_MONTH_SUCCESS:
            return { ...state, spentByMonthGraphData: action.data };

        case types.GET_ONLINE_DATA_SUCCESS:
            return { ...state, onlineGraphData: action.data };

        case types.GET_LAST_LOCATION_SUCCESS:
            return { ...state, lastLocation: action.data };

        case types.GET_MOVIES_SUCCESS:
            return { ...state, movies: action.data.items };

        case types.GET_RECENT_EXPENSES_SUCCESS:
            return { ...state, expenses: action.data.items };

        case types.GET_CONSUMATIONS_SUCCESS:
            return { ...state, consumations: action.data.items };

        case types.GET_CAR_LOG_LATEST_SUCCESS:
            return { ...state, carLogLatest: action.data };

        case types.GET_EXPENSE_SUM_THIS_MONTH_SUCCESS:
            return { ...state, spentThisMonth: action.data };

        case types.GET_EXPENSE_SUM_THIS_WEEK_SUCCESS:
            return { ...state, spentThisWeek: action.data };

        case types.GET_EXPENSE_SUM_TODAY_SUCCESS:
            return { ...state, spentToday: action.data };

        default:
            return state;
    }
}
