import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

interface Props {
    children?: any[];
    defaultCenter?: any;
    defaultZoom?: number;
    refSet?: any;
    onClick?(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent): void;
    onDragEnd?: any;
    onLoad?: (map: google.maps.Map) => void;
    onZoomChanged?(): void;
}

const isDarkTheme = (): boolean => {
    return document.documentElement.getAttribute('data-bs-theme') === 'dark';
};

const Map = ({ onDragEnd, onClick, onZoomChanged, defaultZoom, defaultCenter, children, onLoad: childrenOnload }: Props) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyC2Xp07hffemgAHYenBMKxeAeJ017nIbbk"
    });

    const containerStyle = {
        width: '100%',
        height: '100%'
    };

    const [map, setMap] = React.useState(null);
    const [isDark, setIsDark] = React.useState(isDarkTheme());

    React.useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(isDarkTheme());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-bs-theme'],
        });

        return () => observer.disconnect();
    }, []);

    const onLoad = React.useCallback((map: google.maps.Map) => {
        childrenOnload?.(map);
        map.setCenter(defaultCenter ?? new google.maps.LatLng(0, 0));
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    const options: google.maps.MapOptions = {
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        colorScheme: isDark ? 'DARK' : 'LIGHT'
    };

    return isLoaded ?
        <GoogleMap
            zoom={defaultZoom ?? 15}
            mapContainerStyle={containerStyle}
            options={options}
            onClick={onClick}
            onDragEnd={onDragEnd}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onZoomChanged={onZoomChanged}
        >
            {children}
        </GoogleMap>
        : <></>;
};

export default Map;
