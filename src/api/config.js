import { browserHistory } from 'react-router';
import * as urlHelper from '../utils/urlHelper';
import { httpStatus } from './httpStatus';

let headers = new Headers();
headers.append("Authorization", localStorage.getItem("token"));

//let baseUrl = 'http://api2.anticevic.net/';
let baseUrl = 'http://localhost:4680/';

function handleResponse(response){

    let contentType = response.headers.get("content-type");

    if(response.ok){
        if (contentType && contentType.indexOf("application/json") !== -1)
            return response.json();
        else if(contentType && contentType.indexOf("text/plain") !== -1)
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

    let init = { method: 'GET',
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(url, init).then(handleResponse);
}

export function del(resource, parameters) {
    
    let url = baseUrl + resource;
    if(parameters != undefined)
        url = url + urlHelper.jsonToQueryString(parameters);

    let init = { method: 'DELETE',
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(url, init).then(handleResponse);
}

export function post(resource, json, parameters) {
    
    let url = baseUrl + resource;
    if(parameters != undefined) url = url + urlHelper.jsonToQueryString(parameters);

    headers.append("Content-Type", "application/json");

    let init = { method: 'POST',
                 body: JSON.stringify(json),
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(url, init).then(handleResponse);
}

export function postFile(resource, file) {

    let url = baseUrl + resource;

    let init = { method: 'POST',
                 body: file,
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(url, init).then(handleResponse);
}

export function put(resource, json) {

    let url = baseUrl + resource;

    headers.append("Content-Type", "application/json");

    let init = { method: 'PUT',
                 body: JSON.stringify(json),
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(url, init).then(handleResponse);
}

export function setToken() {
    headers.delete("Authorization");
    headers.append("Authorization", localStorage.getItem("token"));
}