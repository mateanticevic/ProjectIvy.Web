import { Location } from 'types/common';

export function toGoogleMapsLocations(trackings: Location[]) {
    return trackings.map((t) => toGoogleMapsLocation(t));
}

export function toGoogleMapsLocation(tracking: Location) {
    return { lat: tracking.latitude, lng: tracking.longitude };
}
