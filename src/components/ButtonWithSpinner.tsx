import React from 'react';
import { Button } from 'react-bootstrap';
import Spinner from './Spinner';

const ButtonWithSpinner = ({ children, isLoading, onClick }) =>
    <Button
        block
        type="submit"
        variant="primary"
        onClick={onClick}
    >
        {isLoading ? <Spinner size="lg" /> : children}
    </Button>

export default ButtonWithSpinner;
