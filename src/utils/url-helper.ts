export function jsonToQueryString(queryObj, nesting = '') {
    const queryString = '';

    const pairs = Object.entries(queryObj).map(([key, val]) => {
    // Handle a second base case where the value to encode is an array
        if (Array.isArray(val)) {
            return val
                .map(subVal => [nesting + key, subVal].map(escape).join('='))
                .join('&');
        } else if (typeof val === 'object') {
            return jsonToQueryString(val, nesting + `${key}.`);
        } else {
            return [nesting + key, val].map(escape).join('=');
        }
    });
    return pairs.filter(x => x).join('&');
}

export function queryStringToJson(queryString: string) {
    const search = queryString.substring(1);
    return search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
        function (key, value) { return key === '' ? value : parseValue(value); }) : {};
}

function parseValue(value) {
    const decoded = decodeURIComponent(value);

    console.log(`value:${value}`);

    return isNaN(decoded) || decoded[0] === '0' ? decoded : parseInt(value);
}

function objectToArray(parent: string, json: any) {
    return Object.keys(json).map(function (key) {
        return parent + '=' +
      encodeURIComponent(json[key]);
    }).join('&');
}

export function getResourceFromUrl() {
    const resourceIndex = window.location.pathname.lastIndexOf('/') + 1;
    return window.location.pathname.substring(resourceIndex);
}
