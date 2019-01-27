import React from 'react';
import PropTypes from 'prop-types';
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

TripTable.propTypes = {
  children: PropTypes.array
};

export default TripTable;
