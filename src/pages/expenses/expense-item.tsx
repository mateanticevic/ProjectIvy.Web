import ExpenseTypeIcon from 'components/ExpenseTypeIcon';
import moment from 'moment';
import React from 'react';
import { Badge, Card } from 'react-bootstrap';

import { Expense } from 'types/expenses';

interface Props {
    expense: Expense;
}

const formatDate = (date) => moment().diff(moment(date), 'days') > 6 ? moment(date).format('Do MMMM YYYY') : moment(date).format('dddd');

const ExpenseItem = ({ expense }: Props) =>
    <Card>
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
                    {formatDate(expense.timestamp)}
                </div>
            </div>
            <div className="expense-item-currency">{expense.amount.toFixed(2)}  {expense.currency.code}</div>
        </Card.Body>
    </Card>;

export default ExpenseItem;