import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

const ButtonWithSpinner = ({ children, isLoading, onClick }) =>
    <Button
        block
        disabled={isLoading}
        type="submit"
        variant="primary"
        onClick={onClick}
    >
        {isLoading ?
            <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
            />
            :
            children
        }
    </Button>

export default ButtonWithSpinner;
