import React from 'react';
import { Button, FormLabel, FormControl, FormGroup, InputGroup, Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import Select from '../../components/Select';

const BeerModal = (props) => {

    return (
        <Modal
            backdrop="static"
            show={props.isOpen}
            onHide={props.onClose}
            size="sm"
        >
            <Modal.Header closeButton>
                <Modal.Title>New beer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <FormLabel>Name</FormLabel>
                    <FormControl value={props.brand} type="text" onChange={x => props.onChange({ name: x.target.value })} />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Brand</FormLabel>
                    <Select options={props.brands} onChange={id => props.onChange({ brandId: id })} />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Abv</FormLabel>
                    <InputGroup>
                        <FormControl type="number" onChange={x => props.onChange({ abv: x.target.value })} />
                        <InputGroup.Append>%</InputGroup.Append>
                    </InputGroup>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button block variant="primary" onClick={() => { props.onSave(); props.onClose(); }}>
                    <FontAwesome name="save" /> Save
            </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BeerModal;
