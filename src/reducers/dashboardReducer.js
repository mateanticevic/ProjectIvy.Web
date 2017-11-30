import initialState from './initialState';
import * as types from '../constants/dashboardActionTypes';

export default function dashboardReducer(state = initialState.dashboard, action) {

    switch (action.type) {

        case types.GET_ONLINE_DATA_SUCCESS:
            return { ...state, onlineGraphData: action.data };

        default:
            return state;
    }
}
