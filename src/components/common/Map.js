import { default as React, Component } from "react";

import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";

 const Map = withGoogleMap(props => (
  <GoogleMap
    onClick={props.onClick}
    defaultZoom={2}
    defaultCenter={{ lat: 0, lng: 0 }}>
    {props.children}
  </GoogleMap>
));

export default Map;