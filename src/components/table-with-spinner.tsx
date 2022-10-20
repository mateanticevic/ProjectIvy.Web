import React from 'react';
import { Table } from 'react-bootstrap';
import Spinner from './spinner';

const TableWithSpinner = ({ children, isLoading }) => {

    if (isLoading) {
        return <Spinner size="2x" />;
    }

    return (
        <Table responsive>
            <tbody>
                {children}
            </tbody>
        </Table>
    );
};

export default TableWithSpinner;
