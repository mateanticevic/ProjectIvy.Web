import React from 'react';
import Table from 'react-bootstrap/Table';
import ExpenseRow from './ExpenseRow';
import { ExpenseTableLoader } from './ExpenseTableLoader';

const ExpenseTable = (props) => {

    const rows = props.expenses.map(expense => <ExpenseRow key={expense.id} expense={expense} onEdit={props.onEdit} onLink={props.onLink} onUnlink={props.onUnlink} />);

    return (
        <Table responsive>
            <tbody>
                {props.isLoading ?
                    <ExpenseTableLoader />
                    :
                    (rows)
                }
            </tbody>
        </Table>
    );
};

export default ExpenseTable;
