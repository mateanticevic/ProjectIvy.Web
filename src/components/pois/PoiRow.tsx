import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Button } from 'react-bootstrap/lib';

type PoiCategory = { name: string };

type Poi = { name: string, category: PoiCategory, address: string, id: number };

type Props = { poi: Poi, addToTrip: any };

const PoiRow = ({ poi, addToTrip }: Props) => {

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