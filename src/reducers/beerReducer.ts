import initialState from './initialState';
import * as types from '../constants/beerActionTypes';

export default function beerReducer(s = initialState.beer, action) {

    switch (action.type) {

        case types.CONSUMATION_CHANGE:
            return { ...s, consumation: { ...s.consumation, item: action.consumation } };

        case types.BEER_CHANGE:
            return { ...s, beer: action.beer };

        case types.BRAND_CHANGE:
            return { ...s, brand: action.brand };

        case types.GET_BRANDS_SUCCESS:
            return { ...s, brands: action.data };

        case types.GET_CONSUMATIONS_SUCCESS:
            return {
                ...s,
                consumations: action.data.consumations,
                stats: {
                    beers: action.data.beerCount,
                    brands: action.data.brandCount
                }
            };

        case types.GET_CONSUMATION_BEERS_SUCCESS:
            return { ...s, consumation: { ...s.consumation, beers: action.data.items } };

        case types.GET_CONSUMATION_SUM_BY_BEER_SUCCESS:
            return { ...s, topBeers: action.data.items };

        case types.GET_CONSUMATION_SUM_SUCCESS:
            return { ...s, sum: action.data };

        case types.GET_SERVINGS_SUCCESS:
            return { ...s, servings: action.data };

        default:
            return s;
    }
}