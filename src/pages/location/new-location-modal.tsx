import React from 'react';
import { Button, FormControl, Modal, FloatingLabel, FormGroup, FormLabel, Form } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import { Select } from 'components';
import { components } from 'types/ivy-types';

type LocationType = components['schemas']['LocationType'];
type LocationBinding = components['schemas']['LocationBinding'];

interface Props {
    isOpen: boolean,
    location: LocationBinding,
    types: LocationType[],
    onChange(changed: Partial<LocationBinding>): void,
    onClose(): void,
    onSave(): void,
}

const NewLocationModal = ({ isOpen, location, types, onChange, onClose, onSave }: Props) =>
    <Modal
        backdrop="static"
        show={isOpen}
        onHide={onClose}
        size="sm"
    >
        <Modal.Header closeButton>
            <Modal.Title>New location</Modal.Title>
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
                <FloatingLabel label="Type">
                    <Select options={types} onChange={typeId => onChange({ typeId })} />
                </FloatingLabel>
                <FloatingLabel label="Latitude">
                    <FormControl
                        defaultValue={location.latitude}
                        type="number"
                        onChange={latitude => onChange({ latitude })}
                    />
                </FloatingLabel>
                <FloatingLabel label="Longitude">
                    <FormControl
                        defaultValue={location.longitude}
                        type="number"
                        onChange={longitude => onChange({ longitude })}
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

export default NewLocationModal;
