import { browserHistory } from 'react-router';
import * as urlHelper from '../utils/urlHelper';
import { httpStatus } from './httpStatus';
import { httpContentType } from './httpContentType';
import { httpHeader } from './httpHeader';
import { httpMethod } from './httpMethod';

let headers = new Headers();
headers.append(httpHeader.AUTHORIZATION, localStorage.getItem("token"));

let baseUrl = 'http://api2.anticevic.net/';
//let baseUrl = 'http://localhost:4680/';

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

export function get(resource, parameters) {
    
    let url = baseUrl + resource;
    if(parameters != undefined) url = url + urlHelper.jsonToQueryString(parameters);

    let init = { method: httpMethod.GET,
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(url, init).then(handleResponse);
}

export function del(resource, parameters) {
    
    let url = baseUrl + resource;
    if(parameters != undefined)
        url = url + urlHelper.jsonToQueryString(parameters);

    let init = { method: httpMethod.DELETE,
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(url, init).then(handleResponse);
}

export function post(resource, json, parameters) {
    
    let url = baseUrl + resource;
    if(parameters != undefined) url = url + urlHelper.jsonToQueryString(parameters);

    headers.append(httpHeader.CONTENT_TYPE, httpContentType.JSON);

    let init = { method: httpMethod.POST,
                 body: JSON.stringify(json),
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(url, init).then(handleResponse);
}

export function postFile(resource, file) {

    let url = baseUrl + resource;

    let init = { method: httpMethod.POST,
                 body: file,
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(url, init).then(handleResponse);
}

export function put(resource, json) {

    let url = baseUrl + resource;

    headers.append(httpHeader.CONTENT_TYPE, httpContentType.JSON);

    let init = { method: httpMethod.PUT,
                 body: JSON.stringify(json),
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(url, init).then(handleResponse);
}

export function setToken() {
    headers.delete(httpHeaders.AUTHORIZATION);
    headers.append(httpHeaders.AUTHORIZATION, localStorage.getItem("token"));
}