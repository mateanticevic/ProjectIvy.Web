import { DrawMode } from 'consts/location';

export interface Layer {
    id: string;
    drawMode: DrawMode;
    path: google.maps.LatLng[];
}