import React from 'react';
import { Button, ControlLabel, FormControl, FormGroup, Modal } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';

const BrandModal = (props) => {

    return (
        <Modal show={props.isOpen} onHide={props.onClose} bsSize="sm">
            <Modal.Header closeButton>
                <Modal.Title>New brand</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <ControlLabel>Name</ControlLabel>
                    <FormControl type="text" onChange={(x) => props.onChange({ name: x.target.value })} />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button block bsStyle="primary" onClick={props.onSave}>
                    <FontAwesome name="save" /> Save
            </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BrandModal;
