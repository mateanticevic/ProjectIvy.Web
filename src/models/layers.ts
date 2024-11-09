import { components } from 'types/ivy-types';
import _ from 'lodash';

import { Layer } from 'types/location';
import moment from 'moment';
import { trackingToLatLng } from 'utils/gmap-helper';

type Tracking = components['schemas']['Tracking'];

export interface GeohashElement {
    id: string,
    rectangle: number[],
}

export interface Stop {
    end: moment.Moment,
    endIndex: number,
    latLng: google.maps.LatLng,
    start: moment.Moment,
    startIndex: number,
}

export class GeohashLayer implements Layer {
    id: string;
    elements: GeohashElement[];

    constructor(elements: GeohashElement[]) {
        this.id = _.uniqueId();
        this.elements = elements;
    }
}

export class PolygonLayer implements Layer {
    endTracking: Tracking;
    id: string;
    showStops = false;
    showTrackings = false;
    startTracking: Tracking;
    stops: Stop[];
    trackings: Tracking[];

    constructor(trackings: Tracking[]) {
        this.id = _.uniqueId();
        this.trackings = trackings;
        this.startTracking = trackings[0];
        this.stops = getStops(trackings);
        this.endTracking = trackings[trackings.length - 1];
    }
}

export class TrackingLayer implements Layer {
    id: string;
    tracking: Tracking;

    constructor(tracking: Tracking) {
        this.id = _.uniqueId();
        this.tracking = tracking;
    }
}

const getStops = (trackings: Tracking[]) => {
    const stops: Stop[] = [];

    let startIndex = 0;
    for (let i = 0; i < trackings.length - 1; i++) {
        const end = moment(trackings[i + 1].timestamp);
        const start = moment(trackings[i].timestamp);

        if (moment.duration(end.diff(start)).asMinutes() > 10) {
            stops.push({
                end,
                endIndex: i,
                latLng: trackingToLatLng(trackings[i]),
                start,
                startIndex,
            });
            startIndex = i + 1;
        }
    }

    stops.push({
        end: moment(trackings[trackings.length - 1].timestamp),
        endIndex: trackings.length - 1,
        latLng: trackingToLatLng(trackings[trackings.length - 1]),
        start: moment(trackings[startIndex].timestamp),
        startIndex,
    });

    return stops.sort((a, b) => a.startIndex - b.startIndex);
};
