import React from 'react';
import { Table } from 'react-bootstrap/lib';
import Spinner from './Spinner';

const TableWithSpinner = ({ children, isLoading }) => {

    if (isLoading)
        return <Spinner />;

    return (
        <Table responsive>
            <tbody>
                {children}
            </tbody>
        </Table>
    );
}

export default TableWithSpinner;