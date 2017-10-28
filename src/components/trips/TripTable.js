import React from 'react';
import PropTypes from 'prop-types';
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
  children: PropTypes.array
};

export default TripTable;
