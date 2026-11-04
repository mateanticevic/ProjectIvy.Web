export function installMockMaps() {
    class LatLng {
        constructor(private latitude: number, private longitude: number) {}
        lat() { return this.latitude; }
        lng() { return this.longitude; }
        equals(other: LatLng) { return this.lat() === other.lat() && this.lng() === other.lng(); }
    }

    class LatLngBounds {
        private points: LatLng[] = [];

        extend(point: LatLng | { lat: number; lng: number }) {
            this.points.push(point instanceof LatLng ? point : new LatLng(point.lat, point.lng));
            return this;
        }

        isEmpty() { return this.points.length === 0; }
        getNorthEast() {
            return new LatLng(Math.max(...this.points.map(point => point.lat())), Math.max(...this.points.map(point => point.lng())));
        }
        getSouthWest() {
            return new LatLng(Math.min(...this.points.map(point => point.lat())), Math.min(...this.points.map(point => point.lng())));
        }
        getCenter() {
            const northEast = this.getNorthEast();
            const southWest = this.getSouthWest();
            return new LatLng((northEast.lat() + southWest.lat()) / 2, (northEast.lng() + southWest.lng()) / 2);
        }
    }

    class MockMap {
        private center = new LatLng(0, 0);
        private zoom = 0;

        constructor(container: HTMLElement) {
            container.setAttribute('role', 'region');
            container.setAttribute('aria-label', 'Map');
        }

        setOptions() {}
        setCenter(center: LatLng | { lat: number; lng: number }) {
            this.center = center instanceof LatLng ? center : new LatLng(center.lat, center.lng);
        }
        getCenter() { return this.center; }
        setZoom(zoom: number) { this.zoom = zoom; }
        getZoom() { return this.zoom; }
        fitBounds(bounds: LatLngBounds) { this.center = bounds.getCenter(); }
    }

    class Overlay {
        setMap() {}
        setOptions() {}
        setPosition() {}
        setIcon() {}
        setTitle() {}
        setAnimation() {}
        setPath() {}
        setBounds() {}
    }

    const maps = {
        version: 'mock',
        importLibrary: async () => maps,
        Map: MockMap,
        LatLng,
        LatLngBounds,
        Marker: Overlay,
        Polyline: Overlay,
        Rectangle: Overlay,
        Polygon: Overlay,
        OverlayView: Object.assign(function OverlayView() {}, { prototype: { setMap() {} } }),
        event: {
            addListener: () => ({ remove() {} }),
            removeListener() {},
        },
    };

    Object.assign(window, { google: { maps } });
}
