import React from 'react';
import { Button, FormLabel, FormControl, FormGroup, InputGroup, Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import Select from '../../components/Select';

const BeerModal = ({brands, isOpen, styles, onChange, onClose, onSave}) => {

    return (
        <Modal
            backdrop="static"
            show={isOpen}
            onHide={onClose}
            size="sm"
        >
            <Modal.Header closeButton>
                <Modal.Title>New beer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <FormLabel>Name</FormLabel>
                    <FormControl type="text" onChange={x => onChange({ name: x.target.value })} />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Brand</FormLabel>
                    <Select options={brands} onChange={brandId => onChange({ brandId })} />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Style</FormLabel>
                    <Select options={styles} onChange={styleId => onChange({ styleId })} />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Abv</FormLabel>
                    <InputGroup>
                        <FormControl type="number" onChange={x => onChange({ abv: x.target.value })} />
                        <InputGroup.Append>
                            <InputGroup.Text>‰</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button block variant="primary" onClick={() => { onSave(); onClose(); }}>
                    <FontAwesome name="save" /> Save
            </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BeerModal;
