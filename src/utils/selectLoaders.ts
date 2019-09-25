import api from "../api/main";

const genericLoader = (apiMethod, value, callback) => apiMethod({ search: value, pageSize: 5 }).then(data => callback(data.items.map(item => ({ value: item.id, label: item.name }))));

export const beerLoader = (value, callback) => genericLoader(api.beer.get, value, callback);
export const vendorLoader = (value, callback) => genericLoader(api.vendor.get, value, callback);