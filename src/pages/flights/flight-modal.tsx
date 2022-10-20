import React from 'react';
import { FormControl, FormGroup, FormLabel, Modal } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import Datetime from 'react-datetime';

import ButtonWithSpinner from 'components/button-with-spinner';
import { FlightBinding } from 'types/flights';
import { airlineLoader, airportLoader } from 'utils/select-loaders';

interface Props {
    isOpen: boolean,
    onChange(changed: Partial<FlightBinding>): void,
    onClose(): void,
    onSave(): void,
}

const FlightModal = ({ isOpen, onChange, onClose, onSave }: Props) =>
    <Modal
        backdrop="static"
        show={isOpen}
        onHide={onClose}
        size="sm"
    >
        <Modal.Header closeButton>
            <Modal.Title>New flight</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FormGroup>
                <FormLabel>Airline</FormLabel>
                <AsyncSelect
                    defaultOptions
                    loadOptions={airlineLoader}
                    onChange={x => onChange({ airlineId: x.value })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Origin</FormLabel>
                <AsyncSelect
                    defaultOptions
                    loadOptions={airportLoader}
                    onChange={x => onChange({ originId: x.value })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Destination</FormLabel>
                <AsyncSelect
                    defaultOptions
                    loadOptions={airportLoader}
                    onChange={x => onChange({ destinationId: x.value })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Departure</FormLabel>
                <Datetime dateFormat="YYYY-MM-DD" timeFormat="HH:mm" onChange={x => onChange({ departure: x.format('YYYY-MM-DD HH:mm') })} />
            </FormGroup>
            <FormGroup>
                <FormLabel>Arrival</FormLabel>
                <Datetime dateFormat="YYYY-MM-DD" timeFormat="HH:mm" onChange={x => onChange({ arrival: x.format('YYYY-MM-DD HH:mm') })} />
            </FormGroup>
            <FormGroup>
                <FormLabel>Flight number</FormLabel>
                <FormControl type="text" onChange={x => onChange({ flightNumber: x.target.value })} />
            </FormGroup>
        </Modal.Body>
        <Modal.Footer>
            <ButtonWithSpinner
                isLoading={false}
                onClick={onSave}
            >
                Add
            </ButtonWithSpinner>
        </Modal.Footer>
    </Modal>;

export default FlightModal;