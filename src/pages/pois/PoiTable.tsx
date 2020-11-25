import React from 'react';
import Table from 'react-bootstrap/Table';

import { Poi } from '../../types/pois';
import PoiRow from './PoiRow';

interface Props {
  pois: Poi[];
  addToTrip: (tripId: string) => void;
}

const PoiTable: React.SFC<Props> = ({ addToTrip, pois }) => {

    const rows = pois.map(function(poi) {
        return <PoiRow key={poi.id} poi={poi} addToTrip={addToTrip} />;
    });

    return (
        <Table responsive>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Address</th>
                    <th />
                    <th />
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>
    );
};

export default PoiTable;
