import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

interface Props {
    isLoading: boolean;
    onClick: () => void;
}

const ButtonWithSpinner = ({ children, isLoading, onClick }: React.PropsWithChildren<Props>) =>
    <Button
        block
        disabled={!!isLoading}
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
    </Button>;

export default ButtonWithSpinner;
