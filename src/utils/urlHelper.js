export function jsonToQueryString(json) {
    return '?' + 
        Object.keys(json).map(function(key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

export function getResourceFromUrl(){
    let resourceIndex = window.location.pathname.lastIndexOf("/") + 1;
    return window.location.pathname.substring(resourceIndex);
}