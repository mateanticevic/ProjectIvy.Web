import React from 'react';
import { Button, FormControl, Modal, FloatingLabel, FormGroup, FormLabel } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Datetime from 'react-datetime';

import { components } from 'types/ivy-types';

type TrackingBinding = components['schemas']['TrackingBinding'];

interface Props {
    isOpen: boolean,
    tracking: TrackingBinding,
    onChange(changed: Partial<TrackingBinding>): void,
    onClose(): void,
    onSave(): void,
}

const NewLocationModal = ({ isOpen, tracking, onChange, onClose, onSave }: Props) =>
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
                <FormGroup>
                    <FormLabel>Departure</FormLabel>
                    <Datetime
                        dateFormat="YYYY-MM-DD"
                        timeFormat="HH:mm:ss"
                        onChange={x => onChange({ timestamp: x.format('YYYY-MM-DD HH:mm:ss') })}
                    />
                </FormGroup>
                <FloatingLabel label="Latitude">
                    <FormControl
                        defaultValue={tracking.latitude}
                        type="number"
                        onChange={x => onChange({ latitude: x })}
                    />
                </FloatingLabel>
                <FloatingLabel label="Longitude">
                    <FormControl
                        defaultValue={tracking.longitude}
                        type="number"
                        onChange={x => onChange({ longitude: x })}
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
