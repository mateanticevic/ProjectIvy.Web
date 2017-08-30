/* global google */
import {
  default as React,
  Component,
} from "react";

import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

/*
 * Sample From: https://developers.google.com/maps/documentation/javascript/examples/map-simple
 */
 const Map = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={3}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}>
    {props.children}
  </GoogleMap>
));

export default Map;