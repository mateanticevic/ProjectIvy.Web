import React from 'react';
import { Modal } from 'react-bootstrap/lib';

import ButtonWithSpinner from '../../components/ButtonWithSpinner';
import { TripBinding } from 'types/trips';
import TripForm from './TripForm';

interface Props {
  isOpen: boolean;
  loadCities: any;
  onClose: () => void;
  onChange: (changedValue: Partial<TripBinding>) => void;
  onSave: () => void;
}

const TripModal = ({ isOpen, loadCities, onClose, onChange, onSave }: Props) => {
  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>New trip</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TripForm
          onChange={onChange}
          loadCities={loadCities} />
      </Modal.Body>
      <Modal.Footer>
        <ButtonWithSpinner
          isLoading={false}
          onClick={onSave}
        >
          Add
        </ButtonWithSpinner>
      </Modal.Footer>
    </Modal>
  );
};

export default TripModal;
