import api from '../api/main';

const genericApi = (apiMethod, value) => apiMethod({ search: value, pageSize: 5 });

const genericPagedLoader = (apiMethod, value, callback) => genericApi(apiMethod, value).then(data => callback(data.items.map(item => ({ value: item.id, label: item.name }))));

const genericLoader = (apiMethod, value, callback) => apiMethod({ search: value }).then(items => callback(items.map(item => ({ value: item.id, label: item.name }))));

export const airportLoader = (value, callback) => genericApi(api.airport.get, value)
    .then(data => callback(data.items.map(item => ({ value: item.iata, label: `${item.name} (${item.iata})` }))));

export const airlineLoader = (value, callback) => genericLoader(api.common.getAirlines, value, callback);

export const beerLoader = (value, callback) => genericPagedLoader(api.beer.get, value, callback);

export const cityLoader = (value, callback) =>  api.city.get({ search: value })
                                                        .then(cities => callback(cities.items.map(city => ({ value: city.id, label: `${city.name}, ${city.country.name}` }))));

export const poiLoader = (value, callback) => genericPagedLoader(api.poi.get, value, callback);

export const tripLoader = (value, callback) => genericPagedLoader(api.trip.get, value, callback);

export const vendorLoader = (value, callback) => genericPagedLoader(api.vendor.get, value, callback);
