import React from 'react';
import { FormControl, FormGroup, FormLabel, Modal } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { DatetimeInput } from 'components';
import ButtonWithSpinner from 'components/button-with-spinner';
import { airlineLoader, airportLoader } from 'utils/select-loaders';
import { components } from 'types/ivy-types';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';

type Flight = components['schemas']['Flight'];
type FlightBinding = components['schemas']['FlightBinding'];

interface Props {
    flight: Flight,
    flightBinding: FlightBinding,
    isOpen: boolean,
    onChange(changed: Partial<FlightBinding>): void,
    onClose(): void,
    onSave(): void,
}

const FlightModal = ({ flight, flightBinding, isOpen, onChange, onClose, onSave }: Props) => {
    const reactSelectStyles = useReactSelectStyles();
    return <Modal
        backdrop="static"
        show={isOpen}
        onHide={onClose}
        size="sm"
    >
        <Modal.Header closeButton>
            <Modal.Title>{flight.id ?? 'New flight'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FormGroup>
                <FormLabel>Airline</FormLabel>
                <AsyncSelect
                    defaultOptions
                    defaultValue={{ value: flight.airline?.id, label: flight.airline?.name }}
                    loadOptions={airlineLoader}
                    onChange={x => onChange({ airlineId: x.value })}
                    styles={reactSelectStyles}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Origin</FormLabel>
                <AsyncSelect
                    defaultOptions
                    defaultValue={{ value: flight.origin?.iata, label: flight.origin?.name }}
                    loadOptions={airportLoader}
                    onChange={x => onChange({ originId: x.value })}
                    styles={reactSelectStyles}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Destination</FormLabel>
                <AsyncSelect
                    defaultOptions
                    defaultValue={{ value: flight.destination?.iata, label: flight.destination?.name }}
                    loadOptions={airportLoader}
                    onChange={x => onChange({ destinationId: x.value })}
                    styles={reactSelectStyles}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Departure UTC</FormLabel>
                <DatetimeInput
                    timeFormat="HH:mm"
                    value={flightBinding.departure}
                    onChange={departure => onChange({ departure })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Departure Local</FormLabel>
                <DatetimeInput
                    timeFormat="HH:mm"
                    value={flightBinding.departureLocal}
                    onChange={departureLocal => onChange({ departureLocal })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Arrival UTC</FormLabel>
                <DatetimeInput
                    timeFormat="HH:mm"
                    value={flightBinding.arrival}
                    onChange={arrival => onChange({ arrival })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Arrival Local</FormLabel>
                <DatetimeInput
                    timeFormat="HH:mm"
                    value={flightBinding.arrivalLocal}
                    onChange={arrivalLocal => onChange({ arrivalLocal })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Flight number</FormLabel>
                <FormControl
                    type="text"
                    defaultValue={flight.number ?? undefined}
                    onChange={x => onChange({ number: x.target.value })}
                />
            </FormGroup>
        </Modal.Body>
        <Modal.Footer>
            <ButtonWithSpinner
                isLoading={false}
                onClick={onSave}
            >
                Save
            </ButtonWithSpinner>
        </Modal.Footer>
    </Modal>;
};

export default FlightModal;