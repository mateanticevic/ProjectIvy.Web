import React from 'react';
import GoogleMaps from './GoogleMaps';

interface Props {
  refSet?: any;
  onClick?: any;
  onDragEnd?: any;
  defaultZoom?: number;
  defaultCenter?: any;
  children?: any[];
}

const Map = ({ onDragEnd, onClick, defaultZoom, defaultCenter, refSet, children }: Props) => {
    return (
        <GoogleMaps
            onClick={onClick}
            refSet={refSet}
            onDragEnd={onDragEnd}
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
