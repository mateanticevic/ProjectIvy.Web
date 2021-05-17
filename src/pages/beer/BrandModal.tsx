import React from 'react';
import { Button, FormLabel, FormControl, FormGroup, Modal } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { Brand } from 'types/beer';

import Select from 'components/Select';

interface Props {
    countries: any,
    isOpen: boolean,
    onClose: any,
    onSave: any,
    onChange(brandChanged: Partial<Brand>): void,
}

const BrandModal = ({ countries, isOpen, onClose, onChange, onSave }: Props) =>
    <Modal
        backdrop="static"
        show={isOpen}
        onHide={onClose}
        size="sm"
    >
        <Modal.Header closeButton>
            <Modal.Title>New brand</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FormGroup>
                <FormLabel>Name</FormLabel>
                <FormControl
                    type="text"
                    onChange={x => onChange({ name: x.target.value })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Country</FormLabel>
                <Select
                    options={countries}
                    onChange={countryId => onChange({ countryId })}
                />
            </FormGroup>
        </Modal.Body>
        <Modal.Footer>
            <Button block variant="primary" onClick={onSave}>
                <FontAwesome name="save" /> Save
            </Button>
        </Modal.Footer>
    </Modal>;

export default BrandModal;
