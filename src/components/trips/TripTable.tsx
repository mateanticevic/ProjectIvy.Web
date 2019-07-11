import React from 'react';
import Table from 'react-bootstrap/lib/Table';

const TripTable = (props) => {
  return (
    <Table responsive>
      <tbody>
        {props.children}
      </tbody>
    </Table>
  );
};

export default TripTable;
