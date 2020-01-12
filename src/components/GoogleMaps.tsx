import React from 'react';
import { GoogleMap, withGoogleMap } from 'react-google-maps';

const GoogleMaps = withGoogleMap((props) => (
  <GoogleMap
    onClick={props.onClick}
    onDragEnd={() => { if (props.onDragEnd) { props.onDragEnd(); }}}
    defaultZoom={props.defaultZoom}
    defaultCenter={props.defaultCenter}>
    {props.children}
  </GoogleMap>
));

export default GoogleMaps;
