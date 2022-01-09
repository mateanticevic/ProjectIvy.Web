import { components } from 'types/ivy-types';
import _ from 'lodash';

import { Layer } from 'types/location';

type Tracking = components['schemas']['Tracking'];

export class GeohashLayer implements Layer {
    id: string;
    rectangles: number[][];

    constructor(rectangles: number[][]){
        this.id = _.uniqueId();
        this.rectangles = rectangles;
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
