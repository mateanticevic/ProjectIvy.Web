import React from 'react';
import Table from 'react-bootstrap/lib/Table';

export const TripTable = (props) => {
  return (
    <Table responsive>
      <tbody>
        {props.children}
      </tbody>
    </Table>
  );
};
