import React from 'react';
import { FormGroup, FormLabel, Modal } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import Datetime from 'react-datetime';

import ButtonWithSpinner from '~components/ButtonWithSpinner';
import { cityLoader, poiLoader } from '~utils/select-loaders';
import { RideBinding } from '~types/ride';

interface Props {
    isOpen: boolean,
    onChange(changed: Partial<RideBinding>): void,
    onClose(): void,
    onSave(): void,
}

const RideModal = ({ isOpen, onChange, onClose, onSave }: Props) =>
    <Modal
        backdrop="static"
        show={isOpen}
        onHide={onClose}
        size="lg"
    >
        <Modal.Header closeButton>
            <Modal.Title>New ride</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <FormGroup>
                <FormLabel>Origin city</FormLabel>
                <AsyncSelect
                    defaultOptions
                    loadOptions={cityLoader}
                    onChange={x => onChange({ originCityId: x.value })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Origin point</FormLabel>
                <AsyncSelect
                    defaultOptions
                    loadOptions={poiLoader}
                    onChange={x => onChange({ originPoiId: x.value })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Destination city</FormLabel>
                <AsyncSelect
                    defaultOptions
                    loadOptions={cityLoader}
                    onChange={x => onChange({ destinationCityId: x.value })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Destination point</FormLabel>
                <AsyncSelect
                    defaultOptions
                    loadOptions={poiLoader}
                    onChange={x => onChange({ destinationPoiId: x.value })}
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

export default RideModal;