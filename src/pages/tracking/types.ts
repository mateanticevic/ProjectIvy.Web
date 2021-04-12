import { Moment } from "moment";

export interface Movement {
    id: string;
    day: string;
    distance: number;
    trackings: any[];
    color: string;
}

export interface Segment {
    from: Moment;
    to: Moment;
    trackings: Tracking[];
}

export interface Tracking {
    lat: number;
    lng: number;
    timestamp: Date;
}
