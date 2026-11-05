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
        toJSON() {
            return { south: this.getSouthWest().lat(), west: this.getSouthWest().lng(), north: this.getNorthEast().lat(), east: this.getNorthEast().lng() };
        }
        getCenter() {
            const northEast = this.getNorthEast();
            const southWest = this.getSouthWest();
            return new LatLng((northEast.lat() + southWest.lat()) / 2, (northEast.lng() + southWest.lng()) / 2);
        }
    }

    const listeners = new Map<object, Map<string, Set<() => void>>>();
    const emit = (target: object, event: string) => listeners.get(target)?.get(event)?.forEach(callback => callback());

    class MockMap {
        private center = new LatLng(0, 0);
        private zoom = 0;
        private bounds?: LatLngBounds;
        readonly container: HTMLElement;

        constructor(container: HTMLElement) {
            this.container = container;
            window.addEventListener('test-map-bounds', event => {
                const bounds = (event as CustomEvent).detail;
                this.bounds = new LatLngBounds().extend({ lat: bounds.south, lng: bounds.west }).extend({ lat: bounds.north, lng: bounds.east });
                emit(this, 'bounds_changed');
                if (bounds.idle !== false) emit(this, 'idle');
            });
            container.setAttribute('role', 'region');
            container.setAttribute('aria-label', 'Map');
        }

        setOptions() {}
        setCenter(center: LatLng | { lat: number; lng: number }) {
            this.center = center instanceof LatLng ? center : new LatLng(center.lat, center.lng);
        }
        getBounds() {
            return this.bounds ?? new LatLngBounds()
                .extend({ lat: this.center.lat() - 0.001, lng: this.center.lng() - 0.001 })
                .extend({ lat: this.center.lat() + 0.001, lng: this.center.lng() + 0.001 });
        }
        getCenter() { return this.center; }
        setZoom(zoom: number) { this.zoom = zoom; }
        getZoom() { return this.zoom; }
        fitBounds(bounds: LatLngBounds) { this.center = bounds.getCenter(); }
    }

    class Overlay {
        setMap(map?: MockMap) { void map; }
        setOptions(options?: object) { void options; }
        setPosition() {}
        setIcon() {}
        setTitle() {}
        setAnimation() {}
        setPath() {}
        setBounds(bounds?: object) { void bounds; }
    }

    class Rectangle extends Overlay {
        private element = document.createElement('div');
        constructor(options: { map?: MockMap; bounds?: object }) {
            super();
            this.setBounds(options.bounds);
            this.setMap(options.map);
        }
        setBounds(bounds?: object) { this.element.dataset.rectangle = JSON.stringify(bounds); }
        setOptions(options?: object) { this.element.dataset.options = JSON.stringify(options); }
        setMap(map?: MockMap) {
            this.element.remove();
            map?.container.appendChild(this.element);
        }
    }

    const maps = {
        version: 'mock',
        importLibrary: async () => maps,
        Map: MockMap,
        LatLng,
        LatLngBounds,
        Marker: Overlay,
        Polyline: Overlay,
        Rectangle,
        Polygon: Overlay,
        OverlayView: Object.assign(function OverlayView() {}, { prototype: { setMap() {} } }),
        event: {
            addListener: (target: object, event: string, callback: () => void) => {
                if (!listeners.has(target)) listeners.set(target, new Map());
                const events = listeners.get(target)!;
                if (!events.has(event)) events.set(event, new Set());
                events.get(event)!.add(callback);
                return { remove: () => events.get(event)?.delete(callback) };
            },
            removeListener() {},
        },
    };

    Object.assign(window, { google: { maps } });
}
