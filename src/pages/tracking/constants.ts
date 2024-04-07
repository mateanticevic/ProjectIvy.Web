import { PolygonLayer } from "models/layers";
import { components } from "types/ivy-types";

type Route = components['schemas']['Route'];

export interface RoutePoints {
    route: Route,
    points: number[][],
}

export enum DateMode {
    Day,
    Range,
    Last
}

export enum LastNDays {
    One = 'one',
    Week = 'week',
    Month = 'month',
    Year = 'year'
}

export const geohashCharacters = ['b', 'c', 'd', 'e', 'f', 'h', 'g', 'k', 'j', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const lastNDaysOptions = [
    { id: LastNDays.One, name: '24 hours' },
    { id: LastNDays.Week, name: 'Week' },
    { id: LastNDays.Month, name: 'Month' },
    { id: LastNDays.Year, name: 'Year' },
];

export const lastNDaysMapping = {
    [LastNDays.One]: 1,
    [LastNDays.Week]: 7,
    [LastNDays.Month]: 31,
    [LastNDays.Year]: 365,
};

export const rectangleOptionsSelected: google.maps.RectangleOptions = {
    strokeColor: '#0d6efd',
    fillOpacity: 0.1,
    strokeWeight: 4,
};

export const rectangleOptionsVisited: google.maps.RectangleOptions = {
    strokeColor: '#0d6efd',
    fillOpacity: 0,
    strokeWeight: 1,
};

export const rectangleOptionsNonVisited: google.maps.RectangleOptions = {
    strokeColor: '#0d6efd',
    fillOpacity: 0.4,
    strokeWeight: 1,
};

export interface PolygonProps {
    layers: PolygonLayer[];
}