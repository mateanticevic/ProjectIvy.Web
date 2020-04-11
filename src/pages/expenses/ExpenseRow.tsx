import { FaUniversity, FaCreditCard, FaMoneyBill, FaFile, FaPen, FaLink, FaShoppingCart, FaExclamation } from 'react-icons/fa';
import moment from 'moment';
import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { Expense } from 'types/expenses';
import ExpenseTypeLabel from './ExpenseTypeLabel';
import VendorLabel from './VendorLabel';
import { PaymentType } from '../../consts/service';
import { Name } from 'types/common';

interface Props {
  expense: Expense;
  onEdit?: () => void;
  onUnlink?: () => void;
}

const renderPaymentTypeIcon = (name: Name) => {
  switch (name?.id) {
    case PaymentType.Cash:
      return <FaMoneyBill title={name.name} />;
    case PaymentType.CreditCard:
      return <FaCreditCard title={name.name} />;
    case PaymentType.CreditCardOnline:
      return <FaShoppingCart title={name.name} />;
    case PaymentType.WireTransfer:
      return <FaUniversity title={name.name} />;
    default:
      return null;
  }
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
        {renderPaymentTypeIcon(expense.paymentType)}
        {expense.files && expense.files.length > 0 &&
          <OverlayTrigger placement="right" overlay={hasFilesTooltip}>
            <FaFile />
          </OverlayTrigger>
        }
        {expense.needsReview &&
          <OverlayTrigger placement="right" overlay={needsReviewTooltop}>
            <FaExclamation />
          </OverlayTrigger>
        }
      </td>
      <td>
        {onEdit &&
          <Button
            className="pull-right"
            variant="primary"
            size="sm"
            onClick={() => onEdit(expense)}
          >
            <FaPen size="10px" /> Edit
          </Button>
        }
        {onUnlink &&
          <Button className="pull-right" variant="primary" size="sm" onClick={() => onUnlink(expense.id)}><FaLink size="10px" /> Unlink</Button>
        }
      </td>
    </tr>
  );
};

export default ExpenseRow;
