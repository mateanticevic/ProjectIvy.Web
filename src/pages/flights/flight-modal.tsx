import React from 'react';
import { FormControl, FormGroup, FormLabel, Modal } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { DatetimeInput } from 'components';

import ButtonWithSpinner from 'components/button-with-spinner';
import { airlineLoader, airportLoader } from 'utils/select-loaders';
import { components } from 'types/ivy-types';

type FlightBinding = components['schemas']['FlightBinding'];

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
                <DatetimeInput timeFormat="HH:mm" onChange={departure => onChange({ departure })} />
            </FormGroup>
            <FormGroup>
                <FormLabel>Arrival</FormLabel>
                <DatetimeInput timeFormat="HH:mm" onChange={arrival => onChange({ arrival })} />
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