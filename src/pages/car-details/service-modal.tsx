import React from 'react';
import { Button, Form, FormGroup, FormLabel, Modal } from 'react-bootstrap';

import { DateFormElement, Select } from 'components';

interface Props {
    isOpen: boolean;
    service: any;
    types: any;
    onChange(changed: any): void;
    onClose(): void;
    onSave(): void;
}

export const ServiceModal = ({ isOpen, types, onChange, onClose, onSave }: Props) => {
    return (
        <Modal
            backdrop="static"
            onHide={onClose}
            show={isOpen}
        >
            <Modal.Header closeButton>New service</Modal.Header>
            <Modal.Body>
                <DateFormElement
                    label="Date"
                    onChange={date => onChange({ date })}
                />
                <FormGroup>
                    <FormLabel>Type</FormLabel>
                    <Select
                        options={types}
                        onChange={typeId => onChange({ typeId })}
                    />
                </FormGroup>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        onChange={e => onChange({ description: e.target.value })}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button block variant="primary" onClick={onSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};