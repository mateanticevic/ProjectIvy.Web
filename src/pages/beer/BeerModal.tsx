import React from 'react';
import { Button, FormLabel, FormControl, FormGroup, InputGroup, Modal, FloatingLabel, Form } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import Select from 'components/Select';

const BeerModal = ({ brands, isOpen, styles, onChange, onClose, onSave }) => {

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
                <div className="form-grid">
                    <FloatingLabel label="Name">
                        <Form.Control
                            type="text"
                            placeholder="Name"
                            onChange={x => onChange({ name: x.target.value })}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Brand">
                        <Select options={brands} onChange={brandId => onChange({ brandId })} />
                    </FloatingLabel>
                    <FloatingLabel label="Style">
                        <Select options={styles} onChange={styleId => onChange({ styleId })} />
                    </FloatingLabel>
                    <FormGroup>
                        <FormLabel>Abv</FormLabel>
                        <InputGroup>
                            <FormControl type="number" onChange={x => onChange({ abv: x.target.value })} />
                            <InputGroup.Text>‰</InputGroup.Text>
                        </InputGroup>
                    </FormGroup>
                </div>
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
