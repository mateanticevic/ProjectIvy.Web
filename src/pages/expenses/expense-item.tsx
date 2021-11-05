import React from 'react';
import { Badge, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaUniversity, FaCreditCard, FaMoneyBill, FaFile, FaPen, FaLink, FaShoppingCart, FaExclamation } from 'react-icons/fa';
import { RiExchangeDollarLine } from 'react-icons/ri';
import { SiRevolut } from 'react-icons/si';

import ExpenseTypeIcon from 'components/ExpenseTypeIcon';
import { Name } from 'types/common';
import { Expense } from 'types/expenses';
import { PaymentType } from 'consts/service';

interface Props {
    expense: Expense;
    onClick(expense: Expense);
}

const hasFilesTooltip = (expense: Expense) =>
    <Tooltip id="tooltip">
        Has {expense.files.length} linked files
    </Tooltip>;

const renderPaymentTypeIcon = (name: Name) => {
    switch (name?.id) {
        case PaymentType.Cash:
            return <FaMoneyBill title={name.name} />;
        case PaymentType.CreditCard:
            return <FaCreditCard title={name.name} />;
        case PaymentType.CreditCardOnline:
            return <FaShoppingCart title={name.name} />;
        case PaymentType.Revolut:
            return <SiRevolut title={name.name} />;
        case PaymentType.WireTransfer:
            return <FaUniversity title={name.name} />;
        default:
            return null;
    }
};

const ExpenseItem = ({ expense, onClick }: Props) =>
    <Card onClick={() => onClick(expense)}>
        <Card.Body className="expense-item">
            <Badge
                className="expense-type-badge"
                title={expense.expenseType.name}
                variant="primary"
            >
                <ExpenseTypeIcon typeId={expense.expenseType.id} />
            </Badge>
            <div className="expense-item-content">
                <div className="expense-item-title">
                    {expense.comment?.length > 0 ? expense.comment : expense.expenseType.name}
                </div>
                <div className="expense-item-date">
                    {expense.vendor &&
                        `${expense.vendor.name}`
                    }
                </div>
            </div>
            <div className="expense-item-payment">
                <div className="expense-item-payment-type">
                    {renderPaymentTypeIcon(expense.paymentType)}
                    {expense.parentCurrency &&
                        <RiExchangeDollarLine title={`Parent currency ${expense.parentCurrency.code}`} />
                    }
                    {expense.files && expense.files.length > 0 &&
                        <OverlayTrigger placement="right" overlay={hasFilesTooltip(expense)}>
                            <FaFile />
                        </OverlayTrigger>
                    }
                </div>
                <div className="expense-item-amount">{expense.amount.toFixed(2)}  {expense.currency.code}</div>
            </div>
        </Card.Body>
    </Card>;

export default ExpenseItem;