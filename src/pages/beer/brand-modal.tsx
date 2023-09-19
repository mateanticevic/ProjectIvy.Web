import React from 'react';
import { Button, FormControl, Modal, FloatingLabel } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import Select from 'components/select';
import { components } from 'types/ivy-types';

type BeerBrand = components['schemas']['BeerBrand'];

interface Props {
    countries: any,
    isOpen: boolean,
    onChange(brandChanged: Partial<BeerBrand>): void,
    onClose: any,
    onSave: any,
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
