import { default as React } from "react";

import { withGoogleMap, GoogleMap } from "react-google-maps";

 const GoogleMaps = withGoogleMap(props => (
  <GoogleMap
    onClick={props.onClick}
    onDragEnd={() => { if(props.onDragEnd){ props.onDragEnd(); }}}
    defaultZoom={props.defaultZoom}
    center={props.center}
    defaultCenter={{ lat: 0, lng: 0 }}>
    {props.children}
  </GoogleMap>
));

export default GoogleMaps;