import React from 'react';

import * as urlHelper from '../utils/urlHelper';

export class Page<TProps, TState> extends React.Component<TProps, TState> {

    public pushHistoryState(filters) {
        window.history.pushState(null, null, window.location.pathname + '?' + urlHelper.jsonToQueryString(filters));
    }

    public resolveFilters(filters, filterValue) {
        return filterValue ? { ...filters, ...filterValue } : { ...filters, ...(urlHelper.queryStringToJson(window.location.search)) };
    }
}
