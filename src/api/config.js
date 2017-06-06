import * as urlHelper from '../utils/urlHelper';

let headers = new Headers();
headers.append("Authorization", localStorage.getItem("token"));

let baseUrl = 'http://api2.anticevic.net/';

export function get(resource, parameters) {
    
    let url = baseUrl + resource;
    if(parameters != undefined) url = url + urlHelper.jsonToQueryString(parameters);

    let init = { method: 'GET',
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(url, init).then(response => response.json());
}

export function post(resource, parameters, json) {
    
    let url = baseUrl + resource;
    if(parameters != undefined) url = url + urlHelper.jsonToQueryString(parameters);

    let init = { method: 'POST',
                 body: JSON.stringify(json),
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(url, init).then(response => response.json());
}

export function put(resource, json) {

    let url = baseUrl + resource;

    headers.append("Content-Type", "application/json");

    let init = { method: 'PUT',
                 body: JSON.stringify(json),
                 headers: headers,
                 mode: 'cors',
                 cache: 'default'};

    return fetch(url, init).then(response => response.json());
}