import React from 'react';
import { GoogleMap, withGoogleMap } from 'react-google-maps';

interface Props {
  defaultCenter?: google.maps.LatLng;
  defaultZoom: number;
  children: any;
  onClick?(event: google.maps.MouseEvent): void;
  onDragEnd?(): void;
  refSet: any;
}

const defaultOptions: google.maps.MapOptions = {
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: false,
};

const GoogleMaps = withGoogleMap(({ defaultCenter, defaultZoom, children, onClick, onDragEnd, refSet }: Props) => (
    <GoogleMap
        ref={refSet}
        onClick={e => { if (onClick) { onClick(e); } }}
        onDragEnd={() => { if (onDragEnd) { onDragEnd(); } }}
        defaultOptions={defaultOptions}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
    >
        {children}
    </GoogleMap>
));

export default GoogleMaps;
