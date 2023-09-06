import { FaUniversity, FaCreditCard, FaMoneyBill, FaFile, FaPen, FaLink, FaShoppingCart, FaExclamation } from 'react-icons/fa';
import moment from 'moment';
import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { RiExchangeDollarLine } from 'react-icons/ri';

import ExpenseTypeLabel from './expense-type-label';
import VendorLabel from './vendor-label';
import { components } from 'types/ivy-types';
import { PaymentType as PaymentTypes } from 'consts/service';

type Expense = components['schemas']['Expense'];
type PaymentType = components['schemas']['PaymentType'];

interface Props {
    expense: Expense;
    onEdit: (expense: Expense) => void;
    onLink: (id: string) => void;
    onUnlink: (id: string) => void;
}

const renderPaymentTypeIcon = (type: PaymentType) => {
    switch (type?.id) {
        case PaymentTypes.Cash:
            return <FaMoneyBill title={type.name!} />;
        case PaymentTypes.CreditCard:
            return <FaCreditCard title={type.name!} />;
        case PaymentTypes.CreditCardOnline:
            return <FaShoppingCart title={type.name!} />;
        case PaymentTypes.WireTransfer:
            return <FaUniversity title={type.name!} />;
        default:
            return null;
    }
};

const ExpenseRow = ({ expense, onEdit, onLink, onUnlink }: Props) => {
    const hasFilesTooltip = (
        <Tooltip id="tooltip">
            Has {expense!.files!.length} linked files
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
        <tr className={expense.needsReview ? 'warning' : undefined}>
            <td>{formattedDate}</td>
            <td>
                <ExpenseTypeLabel type={expense.expenseType!} />
            </td>
            <td>
                <VendorLabel expense={expense!} />
            </td>
            <td className="cell-no-overflow-100" title={expense.comment!}>{expense.comment}</td>
            <td><span className="pull-right">{expense.amount!.toFixed(2)}</span></td>
            <td>{expense.currency!.symbol}</td>
            <td>
                {renderPaymentTypeIcon(expense.paymentType!)}
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
                {expense.parentCurrency &&
                    <RiExchangeDollarLine title={`Parent currency ${expense.parentCurrency.code}`} />
                }
            </td>
            <td>
                {onEdit &&
                    <Button
                        className="pull-right"
                        variant="primary"
                        size="sm"
                        onClick={() => onEdit(expense!)}
                    >
                        <FaPen size="10px" /> Edit
                    </Button>
                }
                {onLink &&
                    <Button className="pull-right" variant="primary" size="sm" onClick={() => onLink(expense.id!)}><FaLink size="10px" /> Link</Button>
                }
                {onUnlink &&
                    <Button className="pull-right" variant="primary" size="sm" onClick={() => onUnlink(expense.id!)}><FaLink size="10px" /> Unlink</Button>
                }
            </td>
        </tr>
    );
};

export default ExpenseRow;
