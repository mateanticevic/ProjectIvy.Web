import { components } from 'types/ivy-types';
import _ from 'lodash';

import { Layer } from 'types/location';

type Tracking = components['schemas']['Tracking'];

export class PolygonLayer implements Layer {
    id: string;
    renderAsPoints = false;
    trackings: Tracking[];

    constructor(trackings: Tracking[]){
        this.id = _.uniqueId();
        this.trackings = trackings;
    }
}

export class PointLayer implements Layer {
    id: string;
    point: google.maps.LatLng;

    constructor(point: google.maps.LatLng){
        this.id = _.uniqueId();
        this.point = point;
    }
}

export class GeohashLayer implements Layer {
    id: string;
    rectangles: number[][];

    constructor(rectangles: number[][]){
        this.id = _.uniqueId();
        this.rectangles = rectangles;
    }
}