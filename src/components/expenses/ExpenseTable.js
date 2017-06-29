import React from 'react';
import Table from 'react-bootstrap/lib/Table';

const ExpenseTable = (props) => {
  return (
    <Table>
        <thead>
            <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Vendor</th>
            <th>Description</th>
            <th>Amount</th>
            <th/>
            </tr>
            {props.children}
        </thead>
    </Table>
  );
};

export default ExpenseTable;

ExpenseTable.propTypes = {
  children: React.PropTypes.array
};