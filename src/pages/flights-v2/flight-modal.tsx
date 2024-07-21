import React from 'react';
import { FormControl, FormGroup, FormLabel, Modal } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import Datetime from 'react-datetime';

import ButtonWithSpinner from 'components/button-with-spinner';
import { airlineLoader, airportLoader } from 'utils/select-loaders';
import { components } from 'types/ivy-types';
import moment from 'moment';

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

const FlightModal = ({ flight, flightBinding, isOpen, onChange, onClose, onSave }: Props) =>
    <Modal
        backdrop="static"
        show={isOpen}
        onHide={onClose}
        size="sm"
    >
        <Modal.Header closeButton>
            <Modal.Title>{flight.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FormGroup>
                <FormLabel>Airline</FormLabel>
                <AsyncSelect
                    defaultOptions
                    defaultValue={{ value: flight.airline?.id, label: flight.airline?.name }}
                    loadOptions={airlineLoader}
                    onChange={x => onChange({ airlineId: x.value })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Origin</FormLabel>
                <AsyncSelect
                    defaultOptions
                    defaultValue={{ value: flight.origin?.iata, label: flight.origin?.name }}
                    loadOptions={airportLoader}
                    onChange={x => onChange({ originId: x.value })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Destination</FormLabel>
                <AsyncSelect
                    defaultOptions
                    defaultValue={{ value: flight.destination?.iata, label: flight.destination?.name }}
                    loadOptions={airportLoader}
                    onChange={x => onChange({ destinationId: x.value })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Departure UTC</FormLabel>
                <Datetime
                    dateFormat="YYYY-MM-DD"
                    initialValue={moment(flightBinding.departure)}
                    timeFormat="HH:mm"
                    onChange={x => moment.isMoment(x) && onChange({ departure: x.format('YYYY-MM-DD HH:mm') })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Departure Local</FormLabel>
                <Datetime
                    dateFormat="YYYY-MM-DD"
                    initialValue={moment(flightBinding.departureLocal)}
                    timeFormat="HH:mm"
                    onChange={x => moment.isMoment(x) && onChange({ departureLocal: x.format('YYYY-MM-DD HH:mm') })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Arrival UTC</FormLabel>
                <Datetime
                    dateFormat="YYYY-MM-DD"
                    initialValue={moment(flightBinding.arrival)}
                    timeFormat="HH:mm"
                    onChange={x => moment.isMoment(x) && onChange({ arrival: x.format('YYYY-MM-DD HH:mm') })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Arrival Local</FormLabel>
                <Datetime
                    dateFormat="YYYY-MM-DD"
                    initialValue={moment(flightBinding.arrivalLocal)}
                    timeFormat="HH:mm"
                    onChange={x => moment.isMoment(x) && onChange({ arrivalLocal: x.format('YYYY-MM-DD HH:mm') })}
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

export default FlightModal;