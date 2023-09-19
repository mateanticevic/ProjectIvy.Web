import React from 'react';
import { Modal } from 'react-bootstrap';

import ButtonWithSpinner from 'components/button-with-spinner';
import TripForm from './trip-form';
import { components } from 'types/ivy-types';

type TripBinding = components['schemas']['TripBinding'];

interface Props {
    buttonIsLoading: boolean;
    isOpen: boolean;
    onClose: () => void;
    onChange: (changedValue: Partial<TripBinding>) => void;
    onSave: () => void;
}

const TripModal = ({ buttonIsLoading, isOpen, onClose, onChange, onSave }: Props) => {
    return (
        <Modal
            backdrop="static"
            show={isOpen}
            onHide={onClose}
        >
            <Modal.Header closeButton>
                <Modal.Title>New trip</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TripForm
                    onChange={onChange}
                />
            </Modal.Body>
            <Modal.Footer>
                <ButtonWithSpinner
                    isLoading={buttonIsLoading}
                    onClick={onSave}
                >
                    Add
                </ButtonWithSpinner>
            </Modal.Footer>
        </Modal>
    );
};

export default TripModal;
