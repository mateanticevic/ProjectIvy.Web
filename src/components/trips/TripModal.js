import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import TripForm from './TripForm';

const TripModal = (props) => {
  return (
    <Modal show={props.isOpen}>
        <Modal.Header closeButton>
            <Modal.Title>New trip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <TripForm />
        </Modal.Body>
        <Modal.Footer>
            <Button>Add</Button>
            <Button onClick={props.onClose}>Close</Button>
        </Modal.Footer>
    </Modal>
  );
};

export default TripModal;

TripModal.propTypes = {
    isOpen: React.PropTypes.bool,
    onClose: React.PropTypes.func
};