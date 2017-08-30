export function toGoogleMapsLocations(trackings) {
    return trackings.map(t => toGoogleMapsLocation(t));
}

export function toGoogleMapsLocation(tracking) {
    return { lat: tracking.latitude, lng: tracking.longitude };
}
