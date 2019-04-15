import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Modal, FormGroup, Button, ControlLabel, FormControl } from 'react-bootstrap/lib';

const BrandModal = (props) => {

    return (
        <Modal show={props.isOpen} onHide={props.onClose} bsSize="sm">
            <Modal.Header closeButton>
                <Modal.Title>New brand</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <ControlLabel>Name</ControlLabel>
                    <FormControl value={props.brand} type="text" onChange={x => props.onChange({ name: x.target.value })} />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button block bsStyle="primary" onClick={() => { props.onSave(); props.onClose(); }}>
                    <FontAwesome name="save" /> Save
            </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BrandModal;