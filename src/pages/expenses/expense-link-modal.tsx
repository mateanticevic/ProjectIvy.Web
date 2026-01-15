import React from 'react';
import { Button, FormLabel, FormGroup, Modal } from 'react-bootstrap';
import { FaLink } from 'react-icons/fa';
import AsyncSelect from 'react-select/async';

import { tripLoader } from 'utils/select-loaders';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';

const ExpenseLinkModal = ({ isOpen, onClose, onLink, onTripChange }) => {
    const reactSelectStyles = useReactSelectStyles();

    const onLinkClick = () => onLink().then(onClose);

    return (
        <Modal
            backdrop="static"
            show={isOpen}
            onHide={onClose}
            size="sm"
        >
            <Modal.Header closeButton>
                <Modal.Title>Link expense</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <FormLabel>Trip</FormLabel>
                    <AsyncSelect
                        defaultOptions
                        loadOptions={tripLoader}
                        onChange={onTripChange}
                        styles={reactSelectStyles}
                    />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button block variant="primary" onClick={onLinkClick}>
                    <FaLink /> Link
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ExpenseLinkModal;
