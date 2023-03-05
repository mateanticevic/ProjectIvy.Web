import _ from 'lodash';

import * as urlHelper from 'utils/url-helper';
import { httpContentType } from './http-content-type';
import { httpHeader } from './http-header';
import { httpMethod } from './http-method';
import { httpStatus } from './http-status';
import { redirectToAuth } from 'utils/redirect-helper';

const headers = new Headers();

function handleResponse(response) {
    const contentType = response.headers.get(httpHeader.CONTENT_TYPE);

    if (response.ok) {
        if (contentType && contentType.indexOf(httpContentType.JSON) !== -1) {
            return response.json();
        } else if (contentType && contentType.indexOf(httpContentType.TEXT) !== -1) {
            return response.text();
        } else {
            return response.status;
        }
    } else if (response.status == httpStatus.UNAUTHORIZED) {
        redirectToAuth();
    } else {
        //throw new Error(response.status);
    }
}

function apiPath(resource: string, parameters?: any) {
    let url = getBaseApiPath() + resource;
    if (parameters) {
        // url = url + urlHelper.jsonToQueryString(parameters);
        url = url + '?' + urlHelper.jsonToQueryString(parameters);
    }

    return url;
}

function fetchWithTimeout(url, options, timeout: number) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeout)
        )
    ]);
}

const getBaseApiPath = () => `${process.env.API_URL}/`;

export function get(resource: string, parameters?: any, timeout?: number) {

    const init: RequestInit = {
        cache: 'default',
        credentials: 'include',
        headers,
        method: httpMethod.GET,
        mode: 'cors',
    };

    return fetchWithTimeout(apiPath(resource, parameters), init, timeout ?? 30000).then(handleResponse);
}

export function del(resource: string, parameters?: string) {

    const init: RequestInit = {
        credentials: 'include',
        headers,
        method: httpMethod.DELETE,
        mode: 'cors',
    };

    return fetch(apiPath(resource, parameters), init).then(handleResponse);
}

export function post(resource: string, json?: object, parameters?: string) {

    headers.append(httpHeader.CONTENT_TYPE, httpContentType.JSON);

    const init: RequestInit = {
        body: JSON.stringify(json),
        cache: 'default',
        credentials: 'include',
        headers,
        method: httpMethod.POST,
        mode: 'cors',
    };

    return fetch(apiPath(resource, parameters), init).then(handleResponse);
}

export function postFile(resource: string, file: File) {

    const init: RequestInit = {
        body: file,
        cache: 'default',
        credentials: 'include',
        headers,
        method: httpMethod.POST,
        mode: 'cors',
    };

    return fetch(apiPath(resource), init).then(handleResponse);
}

export function put(resource: string, json: object) {

    headers.append(httpHeader.CONTENT_TYPE, httpContentType.JSON);

    const init: RequestInit = {
        body: JSON.stringify(json),
        cache: 'default',
        credentials: 'include',
        headers,
        method: httpMethod.PUT,
        mode: 'cors',
    };

    return fetch(apiPath(resource), init).then(handleResponse);
}
