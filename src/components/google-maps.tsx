import React from 'react';
import { GoogleMap, withGoogleMap } from 'react-google-maps';

interface Props {
  defaultCenter?: google.maps.LatLng;
  defaultZoom: number;
  children: any;
  onClick?(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent): void;
  onDragEnd?(): void;
  onZoomChanged?(): void;
  refSet: any;
}

const defaultOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: false,
};

const GoogleMaps = withGoogleMap(({ defaultCenter, defaultZoom, children, onClick, onDragEnd, onZoomChanged, refSet }: Props) => (
    <GoogleMap
        ref={refSet}
        onClick={onClick}
        onDragEnd={() => { if (onDragEnd) { onDragEnd(); } }}
        onZoomChanged={onZoomChanged}
        defaultOptions={defaultOptions}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
    >
        {children}
    </GoogleMap>
));

export default GoogleMaps;
