export function jsonToQueryString(json) {
    return '?' + 
        Object.keys(json).map(function(key) {

            if(typeof(json[key]) == 'object')
                return objectToArray(key, json[key]);

            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

function objectToArray(parent, json){
    return Object.keys(json).map(function(key) {
            return parent + '.' + encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

export function getResourceFromUrl(){
    let resourceIndex = window.location.pathname.lastIndexOf("/") + 1;
    return window.location.pathname.substring(resourceIndex);
}