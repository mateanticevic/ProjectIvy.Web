import initialState from './initialState';
import * as types from '../constants/beerActionTypes';

export default function beerReducer(state = initialState.beer, action) {

    switch (action.type) {

        case types.CONSUMATION_CHANGE:
            return { ...state, consumation: { ...state.consumation, item: action.consumation } };

        case types.BEER_CHANGE:
            return { ...state, beer: action.beer };

        case types.BRAND_CHANGE:
            return { ...state, brand: action.brand };

        case types.GET_BRANDS_SUCCESS:
            return { ...state, brands: action.data };

        case types.GET_CONSUMATIONS_SUCCESS:
            return { ...state, consumations: action.data };

        case types.GET_CONSUMATION_BEERS_SUCCESS:
            return { ...state, consumation: { ...state.consumation, beers: action.data.items } };

        case types.GET_CONSUMATION_SUM_BY_BEER_SUCCESS:
            return { ...state, topBeers: action.data.items };

        case types.GET_CONSUMATION_SUM_SUCCESS:
            return { ...state, sum: action.data };

        case types.GET_SERVINGS_SUCCESS:
            return { ...state, servings: action.data };

        default:
            return state;
    }
}