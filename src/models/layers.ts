import _ from 'lodash';

import { Layer } from 'types/location';

export class PolygonLayer implements Layer {
    id: string;
    path: google.maps.LatLng[];
    renderAsPoints = false;

    constructor(path: google.maps.LatLng[]){
        this.id = _.uniqueId();
        this.path = path;
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