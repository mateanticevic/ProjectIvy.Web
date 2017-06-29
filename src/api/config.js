import { browserHistory } from 'react-router';
import * as urlHelper from '../utils/urlHelper';
import { httpStatus } from './httpStatus';

let headers = new Headers();
headers.append("Authorization", localStorage.getItem("token"));

let baseUrl = 'http://api2.anticevic.net/';

function handleResponse(response){
    if(response.ok){
        return response.json();
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

export function post(resource, parameters, json) {
    
    let url = baseUrl + resource;
    if(parameters != undefined) url = url + urlHelper.jsonToQueryString(parameters);

    let init = { method: 'POST',
                 body: JSON.stringify(json),
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