import moment from 'moment';
import React from 'react';

import { Expense } from 'types/expenses';
import ExpenseItem from './expense-item';

interface Props {
    day: string;
    expenses: Expense[];
    onExpenseClick(expense: Expense): void;
}

const formatDate = (date) => moment().diff(moment(date), 'days') > 6 ? moment(date).format('Do MMMM YYYY') : moment(date).format('dddd');

const DayExpenses = ({ day, expenses, onExpenseClick }: Props) => {
    return (
        <React.Fragment>
            <h2>{formatDate(day)}</h2>
            {expenses.map(expense =>
                <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    onClick={onExpenseClick}
                />
            )}
        </React.Fragment>
    );
};

export default DayExpenses;