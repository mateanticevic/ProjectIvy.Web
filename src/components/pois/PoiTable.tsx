import React from 'react';
import Table from 'react-bootstrap/lib/Table';

import { Poi } from '../../types/pois';
import PoiRow from './PoiRow';

type Props = {
  pois: Poi[],
  addToTrip: any
};

const PoiTable = ( { addToTrip, pois }: Props) => {
  
  const rows = pois.map(function(poi){
    return <PoiRow key={poi.id} poi={poi} addToTrip={addToTrip} />;
  });

  return (
    <Table>
        <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Address</th>
              <th/>
              <th/>
            </tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
    </Table>
  );
};

export default PoiTable;