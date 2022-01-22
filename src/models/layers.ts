import { components } from 'types/ivy-types';
import _ from 'lodash';

import { Layer } from 'types/location';

type Tracking = components['schemas']['Tracking'];

export interface GeohashElement {
    id: string,
    rectangle: number[],
}

export class GeohashLayer implements Layer {
    id: string;
    elements: GeohashElement[];

    constructor(elements: GeohashElement[]){
        this.id = _.uniqueId();
        this.elements = elements;
    }
}

export class PolygonLayer implements Layer {
    id: string;
    endTracking: Tracking;
    showPoints = false;
    startTracking: Tracking;
    trackings: Tracking[];

    constructor(trackings: Tracking[]){
        this.id = _.uniqueId();
        this.trackings = trackings;
        this.startTracking = trackings[0];
        this.endTracking = trackings[trackings.length - 1];
    }
}

export class TrackingLayer implements Layer {
    id: string;
    tracking: Tracking;

    constructor(tracking: Tracking){
        this.id = _.uniqueId();
        this.tracking = tracking;
    }
}
