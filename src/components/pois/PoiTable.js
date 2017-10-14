import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import PoiRow from './PoiRow';

const PoiTable = (props) => {
  
  const rows = props.pois.map(function(poi){
    return <PoiRow key={poi.id} poi={poi} />;
  });

  return (
    <Table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Address</th>
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
  children: React.PropTypes.array
};