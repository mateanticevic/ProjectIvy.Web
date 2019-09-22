import { default as React } from "react";
import { withGoogleMap, GoogleMap } from "react-google-maps";

 const GoogleMaps = withGoogleMap(props => (
  <GoogleMap
    onClick={props.onClick}
    onDragEnd={() => { if(props.onDragEnd){ props.onDragEnd(); }}}
    defaultZoom={props.defaultZoom}
    center={props.defaultCenter}
    defaultCenter={props.defaultCenter}>
    {props.children}
  </GoogleMap>
));

export default GoogleMaps;