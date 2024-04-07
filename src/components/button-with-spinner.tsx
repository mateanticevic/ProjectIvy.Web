import React from 'react';
import { Button, ButtonProps, Spinner } from 'react-bootstrap';

interface Props {
    isLoading: boolean;
    size?: ButtonProps['size'];
    onClick: () => void;
}

const ButtonWithSpinner = ({ children, isLoading, size, onClick }: React.PropsWithChildren<Props>) =>
    <Button
        disabled={!!isLoading}
        type="submit"
        size={size}
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
