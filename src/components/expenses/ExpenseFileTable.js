import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import Button from 'react-bootstrap/lib/Button';
import FontAwesome from 'react-fontawesome';

const ExpenseFileTable = (props) => {
  
  const rows = props.files.map(function(fileExpense){
    return <tr>
        <td>Now</td>
        <td>{fileExpense.name}</td>
        <td>{fileExpense.file.fileType.name}</td>
        <td><Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={() => window.open(`https://api2.anticevic.net/file/${fileExpense.file.id}`)}><FontAwesome name="download" /> Download</Button></td>
    </tr>;
  });

  return (
    <Table responsive>
        <thead>
            <tr>
              <th>Created</th>
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