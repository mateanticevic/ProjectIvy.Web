export function jsonToQueryString(json: any) {
    if (json === undefined || json === null || json == {}) {
        return '';
    }

    console.log(json);

    return '?' +
        Object.keys(json).map(function(key) {

            if (typeof (json[key]) == 'object') {
                return objectToArray(key, json[key]);
            }

            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).filter(x => x).join('&');
}

export function queryStringToJson(queryString: string) {
    const search = queryString.substring(1);
    return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
        function(key, value) { return key === '' ? value : decodeURIComponent(value); }) : {};
}

function objectToArray(parent: string, json: any) {
    return Object.keys(json).map(function(key) {
        return parent + '=' +
            encodeURIComponent(json[key]);
    }).join('&');
}

export function getResourceFromUrl() {
    const resourceIndex = window.location.pathname.lastIndexOf('/') + 1;
    return window.location.pathname.substring(resourceIndex);
}
