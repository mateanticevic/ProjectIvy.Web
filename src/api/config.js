"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_1 = require("react-router");
const urlHelper = __importStar(require("../utils/urlHelper"));
const httpStatus_1 = require("./httpStatus");
const httpContentType_1 = require("./httpContentType");
const httpHeader_1 = require("./httpHeader");
const httpMethod_1 = require("./httpMethod");
const config_1 = require("../config");
let headers = new Headers();
headers.append(httpHeader_1.httpHeader.AUTHORIZATION, localStorage.getItem("token"));
function handleResponse(response) {
    let contentType = response.headers.get(httpHeader_1.httpHeader.CONTENT_TYPE);
    if (response.ok) {
        if (contentType && contentType.indexOf(httpContentType_1.httpContentType.JSON) !== -1)
            return response.json();
        else if (contentType && contentType.indexOf(httpContentType_1.httpContentType.TEXT) !== -1)
            return response.text();
        else
            return response.status;
    }
    else if (response.status == httpStatus_1.httpStatus.UNAUTHORIZED) {
        react_router_1.browserHistory.push("/login");
    }
    else {
        throw new Error();
    }
}
function apiPath(resource, parameters) {
    let url = config_1.config.api.url + resource;
    if (parameters)
        url = url + urlHelper.jsonToQueryString(parameters);
    return url;
}
function get(resource, parameters) {
    let init = {
        method: httpMethod_1.httpMethod.GET,
        headers: headers,
        mode: 'cors',
        cache: 'default'
    };
    return fetch(apiPath(resource, parameters), init).then(handleResponse);
}
exports.get = get;
function del(resource, parameters) {
    let init = {
        method: httpMethod_1.httpMethod.DELETE,
        headers: headers,
        mode: 'cors'
    };
    return fetch(apiPath(resource, parameters), init).then(handleResponse);
}
exports.del = del;
function post(resource, json, parameters) {
    headers.append(httpHeader_1.httpHeader.CONTENT_TYPE, httpContentType_1.httpContentType.JSON);
    let init = {
        method: httpMethod_1.httpMethod.POST,
        body: JSON.stringify(json),
        headers: headers,
        mode: 'cors',
        cache: 'default'
    };
    return fetch(apiPath(resource, parameters), init).then(handleResponse);
}
exports.post = post;
function postFile(resource, file) {
    let init = {
        method: httpMethod_1.httpMethod.POST,
        body: file,
        headers: headers,
        mode: 'cors',
        cache: 'default'
    };
    return fetch(apiPath(resource), init).then(handleResponse);
}
exports.postFile = postFile;
function put(resource, json) {
    headers.append(httpHeader_1.httpHeader.CONTENT_TYPE, httpContentType_1.httpContentType.JSON);
    let init = {
        method: httpMethod_1.httpMethod.PUT,
        body: JSON.stringify(json),
        headers: headers,
        mode: 'cors',
        cache: 'default'
    };
    return fetch(apiPath(resource), init).then(handleResponse);
}
exports.put = put;
function setToken() {
    headers.delete(httpHeader_1.httpHeader.AUTHORIZATION);
    headers.append(httpHeader_1.httpHeader.AUTHORIZATION, localStorage.getItem("token"));
}
exports.setToken = setToken;
