import { default as React } from "react";
import GoogleMaps from './GoogleMaps';

const Map = (props) => {
  return (
    <GoogleMaps onClick={props.onClick}
      ref={props.map}
      onDragEnd={props.onDragEnd}
      defaultZoom={props.defaultZoom ? props.defaultZoom : 2}
      defaultCenter={props.defaultCenter ? props.defaultCenter : { lat: 0, lng: 0}}
      containerElement={
        <div style={{ height: `100%` }} />
      }
      mapElement={
        <div style={{ height: `100%` }} />
      }>
      {props.children}
    </GoogleMaps>
  );
};

export default Map;