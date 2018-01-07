export function jsonToQueryString(json) {
    return '?' +
        Object.keys(json).map(function (key) {

            if (typeof (json[key]) == 'object')
                return objectToArray(key, json[key]);

            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

export function queryStringToJson(queryString) {
    var search = queryString.substring(1);
    return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
        function (key, value) { return key === "" ? value : decodeURIComponent(value) }) : {}
}

function objectToArray(parent, json) {
    return Object.keys(json).map(function (key) {
        return parent + '.' + encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
    }).join('&');
}

export function getResourceFromUrl() {
    let resourceIndex = window.location.pathname.lastIndexOf("/") + 1;
    return window.location.pathname.substring(resourceIndex);
}