import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Modal, FormGroup, Button, ControlLabel, FormControl, InputGroup } from 'react-bootstrap/lib';

import Select from '../../components/common/Select';

const BeerModal = (props) => {

    return (
        <Modal show={props.isOpen} onHide={props.onClose} bsSize="sm">
            <Modal.Header closeButton>
                <Modal.Title>New beer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <ControlLabel>Name</ControlLabel>
                    <FormControl value={props.brand} type="text" onChange={x => props.onChange({ name: x.target.value })} />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Brand</ControlLabel>
                    <Select options={props.brands} onChange={id => props.onChange({ brandId: id })} />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Abv</ControlLabel>
                    <InputGroup>
                        <FormControl type="number" onChange={x => props.onChange({ abv: x.target.value })} />
                        <InputGroup.Addon>%</InputGroup.Addon>
                    </InputGroup>
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

export default BeerModal;