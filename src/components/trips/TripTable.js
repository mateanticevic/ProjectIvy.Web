import React from 'react';
import Table from 'react-bootstrap/lib/Table';

const TripTable = (props) => {
  return (
    <Table>
        <thead>
            <tr>
            <th>Start</th>
            <th>Name</th>
            <th>Duration</th>
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
