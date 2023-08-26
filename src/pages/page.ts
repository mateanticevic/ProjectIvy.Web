import React from 'react';

import * as urlHelper from 'utils/url-helper';

export class Page<TProps, TState> extends React.Component<TProps, TState> {

    public pushHistoryState(filters) {
        const queryString = urlHelper.jsonToQueryString(filters);
        const state = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
        
        window.history.pushState(null, null, state);
    }

    public resolveFilters(filters, filterValue) {
        return filterValue ? {
            ...filters,
            ...filterValue
        }
            : {
                ...filters,
                ...(urlHelper.queryStringToJson(window.location.search))
            };
    }
}
