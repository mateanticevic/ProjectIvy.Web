import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import FontAwesome from 'react-fontawesome';
import Moment from 'react-moment';

const ExpenseFileRow = ({expenseFile}) => {

  return (
        <tr>
            <td><Moment format="Do MMMM YYYY">{expenseFile.file.created}</Moment></td>
            <td>{expenseFile.name}</td>
            <td>{expenseFile.type.name}</td>
            <td>
                <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={() => window.open(`https://api2.anticevic.net/file/${expenseFile.file.id}`)}>
                    <FontAwesome name="download" /> Download
                </Button>
            </td>
        </tr>
  );
};

export default ExpenseFileRow;