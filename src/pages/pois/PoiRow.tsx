import React from 'react';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import { Poi } from '~types/pois';

interface Props {
  poi: Poi;
  addToTrip: (tripId: string) => void;
}

const PoiRow: React.SFC<Props> = ({ poi, addToTrip }) => {

    return (
        <tr>
            <td>{poi.name}</td>
            <td>{poi.category.name}</td>
            <td>{poi.address}</td>
            <td>
                <Button className="pull-right" variant="primary" size="xsmall" onClick={() => addToTrip(poi.id)}>
                    <FontAwesome name="link" /> Link to trip
                </Button>
            </td>
            <td>
                <Button className="pull-right" variant="primary" size="xsmall">
                    <FontAwesome name="map" /> Show
                </Button>
            </td>
        </tr>
    );
};

export default PoiRow;
