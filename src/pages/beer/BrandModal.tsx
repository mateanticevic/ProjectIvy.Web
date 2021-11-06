import React from 'react';
import { Button, FormControl, Modal, FloatingLabel } from 'react-bootstrap';
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
            <div className="form-grid">
                <FloatingLabel label="Name">
                    <FormControl
                        placeholder="Name"
                        type="text"
                        onChange={x => onChange({ name: x.target.value })}
                    />
                </FloatingLabel>
                <FloatingLabel label="Country">
                    <Select
                        options={countries}
                        onChange={countryId => onChange({ countryId })}
                    />
                </FloatingLabel>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={onSave}>
                <FontAwesome name="save" /> Save
            </Button>
        </Modal.Footer>
    </Modal>;

export default BrandModal;
