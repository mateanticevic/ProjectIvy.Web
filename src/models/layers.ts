import { components } from 'types/ivy-types';
import _ from 'lodash';
import mtz from 'moment-timezone';

import { Layer } from 'types/location';
import moment from 'moment';

type Tracking = components['schemas']['Tracking'];

export interface GeohashElement {
    id: string,
    rectangle: number[],
}

export interface Segment {
    end: moment.Moment,
    endIndex: number,
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
    segments: Segment[];
    timezone?: string;
    trackings: Tracking[];

    constructor(trackings: Tracking[], timezone?: string) {
        this.endTracking = trackings[trackings.length - 1];
        this.id = _.uniqueId();
        this.segments = getSegments(trackings, timezone);
        this.startTracking = trackings[0];
        this.timezone = timezone;
        this.trackings = trackings;
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

const getSegments = (trackings: Tracking[], timezone?: string) => {
    const segments: Segment[] = [];

    let startIndex = 0;
    for (let i = 0; i < trackings.length - 1; i++) {
        const end = moment(trackings[i + 1].timestamp);
        const start = moment(trackings[i].timestamp);

        if (moment.duration(end.diff(start)).asMinutes() > 10) {
            segments.push({
                end: timezone ? mtz.utc(trackings[i].timestamp).tz(timezone) : moment(trackings[i].timestamp),
                endIndex: i,
                start: timezone ? mtz.utc(trackings[startIndex].timestamp).tz(timezone) : moment(trackings[startIndex].timestamp),
                startIndex,
            });
            startIndex = i + 1;
        }
    }

    segments.push({
        end: moment(trackings[trackings.length - 1].timestamp),
        endIndex: trackings.length - 1,
        start: moment(trackings[startIndex].timestamp),
        startIndex,
    });

    return segments.sort((a, b) => a.startIndex - b.startIndex);
};
