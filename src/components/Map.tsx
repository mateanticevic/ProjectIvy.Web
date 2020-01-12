import React from 'react';
import GoogleMaps from './GoogleMaps';

interface Props {
  map: any;
  onClick: any;
  onDragEnd: any;
  defaultZoom: number;
  defaultCenter: any;
  children: any[];
}

const Map = ({ map, onDragEnd, onClick, defaultZoom, defaultCenter, children }: Props) => {
  return (
    <GoogleMaps
      onClick={onClick}
      ref={map}
      onDragEnd={onDragEnd}
      defaultZoom={defaultZoom ? defaultZoom : 2}
      defaultCenter={defaultCenter ? defaultCenter : { lat: 0, lng: 0 }}
      containerElement={<div style={{ height: `100%` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    >
      {children}
    </GoogleMaps>
  );
};

export default Map;
