import React from 'react';
import moment from 'moment';
import FontAwesome from 'react-fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-regular-svg-icons'
import ExpenseType from './ExpenseType';
import ExpenseVendor from './ExpenseVendor';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap/lib';

const ExpenseRow = (props) => {

  const hasFilesTooltip = (
    <Tooltip id="tooltip">
      Has {props.expense.files.length} linked files.
    </Tooltip>
  );

  const exactDate = moment().diff(moment(props.expense.date), 'days') > 6;

  const formattedDate = exactDate ? moment(props.expense.date).format('Do MMMM YYYY') : moment(props.expense.date).format('dddd');

  return (
    <tr>
      <td>{formattedDate}</td>
      <td>
        <ExpenseType expense={props.expense} />
      </td>
      <td>
        <ExpenseVendor expense={props.expense} />
      </td>
      <td className="cell-no-overflow-100" title={props.expense.comment}>{props.expense.comment}</td>
      <td><span className="pull-right">{props.expense.amount.toFixed(2)}</span></td>
      <td>{props.expense.currency.symbol}</td>
      <td>
        {props.expense.files && props.expense.files.length > 0 &&
          <OverlayTrigger placement="right" overlay={hasFilesTooltip}>
            <FontAwesomeIcon icon={faFile} />
          </OverlayTrigger>}
      </td>
      <td>
        {props.onEdit &&
          <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={() => props.onEdit(props.expense)}><FontAwesome name="pencil" /> Edit</Button>
        }
        {props.onUnlink &&
          <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={() => props.onUnlink(props.expense.id)}><FontAwesome name="link" /> Unlink</Button>
        }
      </td>
    </tr>
  );
};

export default ExpenseRow;
