import React from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/lib/Table';
import PoiRow from './PoiRow';

const PoiTable = (props) => {
  
  const rows = props.pois.map(function(poi){
    return <PoiRow key={poi.id} poi={poi} addToTrip={props.addToTrip} />;
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

PoiTable.propTypes = {
  children: PropTypes.array
};