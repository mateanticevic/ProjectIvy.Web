import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import ExpenseFileUploadRow from './ExpenseFileUploadRow';

const ExpenseFileUploadTable = (props) => {
  
  const rows = props.files.map(function(file){
    return <ExpenseFileUploadRow file={file} linkFile={props.linkFile} common={props.common} />;
  });

  return (
    <Table responsive>
        <thead>
            <tr>
              <th>File type</th>
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

export default ExpenseFileUploadTable;