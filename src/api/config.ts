import { config } from '../config';
import * as urlHelper from '../utils/urlHelper';
import { httpContentType } from './httpContentType';
import { httpHeader } from './httpHeader';
import { httpMethod } from './httpMethod';
import { httpStatus } from './httpStatus';

const headers = new Headers();
headers.append(httpHeader.AUTHORIZATION, localStorage.getItem('token'));

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
        window.location = '/login';
    } else {
        throw new Error();
    }
}

function apiPath(resource: string, parameters?: string) {
    let url = config.api.url + resource;
    if (parameters) {
        url = url + urlHelper.jsonToQueryString(parameters);
    }

    return url;
}

export function get(resource: string, parameters?: string) {

    const init: RequestInit = {
        cache: 'default',
        headers,
        method: httpMethod.GET,
        mode: 'cors',
    };

    return fetch(apiPath(resource, parameters), init).then(handleResponse);
}

export function del(resource: string, parameters?: string) {

    const init: RequestInit = {
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
        headers,
        method: httpMethod.POST,
        mode: 'cors',
    };

    return fetch(apiPath(resource, parameters), init).then(handleResponse);
}

export function postFile(resource: string, file: any) {

    const init: RequestInit = {
        body: file,
        cache: 'default',
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
        headers,
        method: httpMethod.PUT,
        mode: 'cors',
    };

    return fetch(apiPath(resource), init).then(handleResponse);
}

export function setToken() {
    headers.delete(httpHeader.AUTHORIZATION);
    headers.append(httpHeader.AUTHORIZATION, localStorage.getItem('token'));
}
