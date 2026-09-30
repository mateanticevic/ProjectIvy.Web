import { PolygonLayer } from "models/layers";
import { components } from "types/ivy-types";
import colorTokens from 'styles/color-tokens.module.scss';

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
    fillColor: colorTokens.colorPrimary,
    fillOpacity: 0.1,
    strokeWeight: 0,
};

export const rectangleOptionsVisited: google.maps.RectangleOptions = {
    fillColor: colorTokens.colorPrimary,
    fillOpacity: 0,
    strokeWeight: 0,
};

export const rectangleOptionsNonVisited: google.maps.RectangleOptions = {
    fillColor: colorTokens.colorPrimary,
    fillOpacity: 0.4,
    strokeWeight: 0,
};

export interface PolygonProps {
    layers: PolygonLayer[];
}

export const polylineColors = [
    { name: 'Primary', value: colorTokens.colorPrimary },
    { name: 'Red', value: '#e6194b' },
    { name: 'Green', value: '#3cb44b' },
    { name: 'Gold', value: '#d4a017' },
    { name: 'Blue', value: '#4363d8' },
    { name: 'Orange', value: '#f58231' },
    { name: 'Purple', value: '#911eb4' },
    { name: 'Cyan', value: '#0097b2' },
    { name: 'Magenta', value: '#f032e6' },
    { name: 'Lime', value: '#7cb518' },
    { name: 'Rose', value: '#e06090' },
    { name: 'Teal', value: '#469990' },
    { name: 'Violet', value: '#7b4db5' },
    { name: 'Brown', value: '#9a6324' },
    { name: 'Maroon', value: '#800000' },
    { name: 'Emerald', value: '#1f8a5b' },
    { name: 'Olive', value: '#808000' },
    { name: 'Coral', value: '#e07a3d' },
    { name: 'Navy', value: '#000075' },
    { name: 'Slate', value: '#5c6370' },
    { name: 'Charcoal', value: '#263238' },
];

export const nextPolylineColor = (usedColors: string[]) => {
    const counts = new Map(polylineColors.map(color => [color.value, 0]));

    usedColors.forEach(color => {
        if (counts.has(color)) {
            counts.set(color, (counts.get(color) ?? 0) + 1);
        }
    });

    return polylineColors.reduce((selected, color) => {
        const selectedCount = counts.get(selected.value) ?? 0;
        const colorCount = counts.get(color.value) ?? 0;
        return colorCount < selectedCount ? color : selected;
    }).value;
};