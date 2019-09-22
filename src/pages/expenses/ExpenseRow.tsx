import { faFile } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';

import { Expense } from 'types/expenses';
import ExpenseTypeLabel from './ExpenseTypeLabel';
import VendorLabel from './VendorLabel';

interface Props {
  expense: Expense;
  onEdit?: () => void;
  onUnlink?: () => void;
}

const ExpenseRow = ({ expense, onEdit, onUnlink }: Props) => {

  const hasFilesTooltip = (
    <Tooltip id="tooltip">
      Has {expense.files.length} linked files
    </Tooltip>
  );

  const needsReviewTooltop = (
    <Tooltip id="tooltip">
      Needs review
    </Tooltip>
  );

  const exactDate = moment().diff(moment(expense.date), 'days') > 6;

  const formattedDate = exactDate ? moment(expense.date).format('Do MMMM YYYY') : moment(expense.date).format('dddd');

  return (
    <tr>
      <td>{formattedDate}</td>
      <td>
        <ExpenseTypeLabel expenseType={expense.expenseType} />
      </td>
      <td>
        <VendorLabel expense={expense} />
      </td>
      <td className="cell-no-overflow-100" title={expense.comment}>{expense.comment}</td>
      <td><span className="pull-right">{expense.amount.toFixed(2)}</span></td>
      <td>{expense.currency.symbol}</td>
      <td>
        {expense.files && expense.files.length > 0 &&
          <OverlayTrigger placement="right" overlay={hasFilesTooltip}>
            <FontAwesomeIcon icon={faFile} />
          </OverlayTrigger>}
        {expense.needsReview &&
          <OverlayTrigger placement="right" overlay={needsReviewTooltop}>
            <FontAwesome name="exclamation" />
          </OverlayTrigger>}
      </td>
      <td>
        {onEdit &&
          <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={() => onEdit(expense)}><FontAwesome name="pencil" /> Edit</Button>
        }
        {onUnlink &&
          <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={() => onUnlink(expense.id)}><FontAwesome name="link" /> Unlink</Button>
        }
      </td>
    </tr>
  );
};

export default ExpenseRow;
