import { browserHistory } from 'react-router';
import * as urlHelper from '../utils/urlHelper';
import { httpStatus } from './httpStatus';
import { httpContentType } from './httpContentType';
import { httpHeader } from './httpHeader';
import { httpMethod } from './httpMethod';
import { config } from '../config';

let headers = new Headers();
headers.append(httpHeader.AUTHORIZATION, localStorage.getItem("token"));

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

function apiPath(resource, parameters){
    let url = config.api.url + resource;
    if(parameters)
        url = url + urlHelper.jsonToQueryString(parameters);

    return url;
}

export function get(resource, parameters) {

    let init = { method: httpMethod.GET,
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(apiPath(resource, parameters), init).then(handleResponse);
}

export function del(resource, parameters) {

    let init = { method: httpMethod.DELETE,
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(apiPath(resource, parameters), init).then(handleResponse);
}

export function post(resource, json, parameters) {

    headers.append(httpHeader.CONTENT_TYPE, httpContentType.JSON);

    let init = { method: httpMethod.POST,
                 body: JSON.stringify(json),
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(apiPath(resource, parameters), init).then(handleResponse);
}

export function postFile(resource, file) {

    let init = { method: httpMethod.POST,
                 body: file,
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(apiPath(resource), init).then(handleResponse);
}

export function put(resource, json) {

    headers.append(httpHeader.CONTENT_TYPE, httpContentType.JSON);

    let init = { method: httpMethod.PUT,
                 body: JSON.stringify(json),
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(apiPath(resource), init).then(handleResponse);
}

export function setToken() {
    headers.delete(httpHeader.AUTHORIZATION);
    headers.append(httpHeader.AUTHORIZATION, localStorage.getItem("token"));
}