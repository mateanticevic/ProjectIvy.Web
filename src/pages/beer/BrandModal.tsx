import React from 'react';
import { Button, FormLabel, FormControl, FormGroup, Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

const BrandModal = (props) => {

    return (
        <Modal show={props.isOpen} onHide={props.onClose} size="sm">
            <Modal.Header closeButton>
                <Modal.Title>New brand</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <FormLabel>Name</FormLabel>
                    <FormControl type="text" onChange={x => props.onChange({ name: x.target.value })} />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button block variant="primary" onClick={props.onSave}>
                    <FontAwesome name="save" /> Save
            </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BrandModal;
