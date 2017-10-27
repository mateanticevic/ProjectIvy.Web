import React from 'react';
import Table from 'react-bootstrap/lib/Table';

const TripTable = (props) => {
  return (
    <Table responsive >
        <thead>
            <tr>
            <th>Year</th>
            <th>Countries</th>
            <th>Name</th>
            <th>Duration</th>
            <th/>
            </tr>
            {props.children}
        </thead>
    </Table>
  );
};

TripTable.propTypes = {
  children: React.PropTypes.array
};

export default TripTable;
