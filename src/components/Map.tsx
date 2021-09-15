import React from 'react';
import GoogleMaps from './GoogleMaps';

interface Props {
  refSet?: any;
  onClick?(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent): void;
  onDragEnd?: any;
  onZoomChanged?(): void;
  defaultZoom?: number;
  defaultCenter?: any;
  children?: any[];
}

const Map = ({ onDragEnd, onClick, onZoomChanged, defaultZoom, defaultCenter, refSet, children }: Props) => {
    return (
        <GoogleMaps
            onClick={onClick}
            refSet={refSet}
            onDragEnd={onDragEnd}
            onZoomChanged={onZoomChanged}
            defaultCenter={defaultCenter ? defaultCenter : { lat: 0, lng: 0 }}
            defaultZoom={defaultZoom ? defaultZoom : 2}
            containerElement={<div style={{ height: '100%' }} />}
            mapElement={<div style={{ height: '100%' }} />}
        >
            {children}
        </GoogleMaps>
    );
};

export default Map;
