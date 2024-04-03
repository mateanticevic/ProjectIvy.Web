import api from "api/main";
import { cityLoader, countryLoader, locationLoader } from "utils/select-loaders";

export const itemGeohashRectangleOptions: google.maps.RectangleOptions = {
    strokeColor: '#007BFF',
    fillColor: '#007BFF',
    fillOpacity: 0.2,
    strokeWeight: 1,
};

export const deleteRectangleOptions: google.maps.RectangleOptions = {
    strokeColor: '#dc3545',
    fillOpacity: 0.1,
    strokeWeight: 1,
};

export const rectangleOptions: google.maps.RectangleOptions = {
    fillOpacity: 0,
    strokeColor: '#0d6efd',
    strokeWeight: 1,
};

export enum ItemType {
    City = 'city',
    Country = 'country',
    Location = 'location',
}

export enum SelectType {
    Divide = 'divide',
    Select = 'select',
}

export const apis = {
    [ItemType.City]: api.city,
    [ItemType.Country]: api.country,
    [ItemType.Location]: api.location,
};

export const loaders = {
    [ItemType.City]: cityLoader,
    [ItemType.Country]: countryLoader,
    [ItemType.Location]: locationLoader,
};