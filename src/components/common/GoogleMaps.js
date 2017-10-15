import { default as React } from "react";

import { withGoogleMap, GoogleMap } from "react-google-maps";

 const GoogleMaps = withGoogleMap(props => (
  <GoogleMap
    onClick={props.onClick}
    onDragEnd={() => { if(props.onDragEnd){ props.onDragEnd(); }}}
    defaultZoom={2}
    defaultCenter={{ lat: 0, lng: 0 }}>
    {props.children}
  </GoogleMap>
));

export default GoogleMaps;