import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

import TripForm from './TripForm';
import { TripBinding } from 'types/trips';

type Props = {
  isOpen: boolean,
  loadCities: any,
  onClose: () => void,
  onChange: (changedValue: Partial<TripBinding>) => void,
  onSave: () => void,
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
        <Button onClick={onSave}>Add</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TripModal;
