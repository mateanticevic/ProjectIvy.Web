import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import ExpenseFileRow from './ExpenseFileRow';

const ExpenseFileTable = (props) => {

  const rows = props.files.map(function (expenseFile) {
    return <ExpenseFileRow key={expenseFile.file.id} expenseFile={expenseFile} />;
  });

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Created</th>
          <th>Size</th>
          <th>Name</th>
          <th>Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default ExpenseFileTable;