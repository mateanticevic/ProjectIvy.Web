import React from 'react';
import { Button } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';

import { Poi } from '../../types/pois';

interface Props {
  addToTrip: (tripId: string) => void;
  poi: Poi;
}

const PoiRow: React.SFC<Props> = ({ poi, addToTrip }) => {

  return (
    <tr>
      <td>{poi.name}</td>
      <td>{poi.category.name}</td>
      <td>{poi.address}</td>
      <td>
        <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={() => addToTrip(poi.id)}>
          <FontAwesome name="link" /> Link to trip
        </Button>
      </td>
      <td>
        <Button className="pull-right" bsStyle="primary" bsSize="xsmall">
          <FontAwesome name="map" /> Show
        </Button>
      </td>
    </tr>
  );
};

export default PoiRow;
