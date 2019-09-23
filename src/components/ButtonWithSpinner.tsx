import React from 'react';
import { Button } from 'react-bootstrap/lib';
import Spinner from './Spinner';

const ButtonWithSpinner = ({ children, isLoading, onClick }) => {
    return (<Button block type="submit" bsStyle="primary" onClick={onClick}>
        {isLoading ? <Spinner size="lg" /> : children}
    </Button>);
};

export default ButtonWithSpinner;
