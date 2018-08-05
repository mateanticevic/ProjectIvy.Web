import initialState from './initialState';
import * as types from '../constants/beerActionTypes';

export default function beerReducer(state = initialState.beer, action) {

    switch (action.type) {

        case types.GET_CONSUMATIONS_SUCCESS:
            return { ...state, consumations: action.data };

        case types.GET_CONSUMATION_SUM_SUCCESS:
            return { ...state, sum: action.data };

        default:
            return state;
    }
}