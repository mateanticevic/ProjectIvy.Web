import { browserHistory } from 'react-router';
import * as urlHelper from '../utils/urlHelper';
import { httpStatus } from './httpStatus';
import { httpContentType } from './httpContentType';
import { httpHeader } from './httpHeader';
import { httpMethod } from './httpMethod';
import { config } from '../config';

let headers = new Headers();
headers.append(httpHeader.AUTHORIZATION, localStorage.getItem("token"));

type FetchInit = {
    method: string,
    headers: Headers,
    mode: string,
    cache: string,
    body?: string
};

function handleResponse(response){

    let contentType = response.headers.get(httpHeader.CONTENT_TYPE);

    if(response.ok){
        if (contentType && contentType.indexOf(httpContentType.JSON) !== -1)
            return response.json();
        else if(contentType && contentType.indexOf(httpContentType.TEXT) !== -1)
            return response.text();
        else
            return response.status;
    }
    else if(response.status == httpStatus.UNAUTHORIZED){
        browserHistory.push("/login");
    }
    else{
        throw new Error();
    }
}

function apiPath(resource: string, parameters?: string){
    let url = config.api.url + resource;
    if(parameters)
        url = url + urlHelper.jsonToQueryString(parameters);

    return url;
}

export function get(resource: string, parameters?: string) {

    let init: RequestInit = {
        method: httpMethod.GET,
        headers: headers,
        mode: 'cors',
        cache: 'default'
    };

    return fetch(apiPath(resource, parameters), init).then(handleResponse);
}

export function del(resource: string, parameters?: string) {

    let init: RequestInit = {
        method: httpMethod.DELETE,
        headers: headers,
        mode: 'cors'
    };

    return fetch(apiPath(resource, parameters), init).then(handleResponse);
}

export function post(resource: string, json?: object, parameters?: string) {

    headers.append(httpHeader.CONTENT_TYPE, httpContentType.JSON);

    let init: RequestInit = {
        method: httpMethod.POST,
        body: JSON.stringify(json),
        headers: headers,
        mode: 'cors',
        cache: 'default'
    };

    return fetch(apiPath(resource, parameters), init).then(handleResponse);
}

export function postFile(resource: string, file: any) {

    let init: RequestInit = {
        method: httpMethod.POST,
        body: file,
        headers: headers,
        mode: 'cors',
        cache: 'default'
    };

    return fetch(apiPath(resource), init).then(handleResponse);
}

export function put(resource: string, json: object) {

    headers.append(httpHeader.CONTENT_TYPE, httpContentType.JSON);

    let init: RequestInit = {
        method: httpMethod.PUT,
        body: JSON.stringify(json),
        headers: headers,
        mode: 'cors',
        cache: 'default'
    };

    return fetch(apiPath(resource), init).then(handleResponse);
}

export function setToken() {
    headers.delete(httpHeader.AUTHORIZATION);
    headers.append(httpHeader.AUTHORIZATION, localStorage.getItem("token"));
}