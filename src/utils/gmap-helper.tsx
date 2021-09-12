import React from 'react';
import { Polygon } from 'react-google-maps';
import _ from 'lodash';

import { CountryPolygon } from 'types/common';
import { toGoogleMapsLocations } from './tracking-helper';
import { components } from 'types/ivy-types';

type Tracking = components['schemas']['Tracking'];

export const convertToPolygons = (countryPolygons: CountryPolygon[]) =>
    _.flatten(countryPolygons.map(country => country.polygons.map(locations => <Polygon key={_.uniqueId('polygon_country_')} path={toGoogleMapsLocations(locations)} />)));

export const trackingToLatLng = (trackings: Tracking[]): google.maps.LatLng[] =>
    trackings.map(tracking => {
        return new google.maps.LatLng(tracking.latitude, tracking.longitude);
    });