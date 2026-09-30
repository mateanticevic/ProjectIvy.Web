import React from 'react';
import { Col, Form, FormGroup, FormLabel, Modal } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { DatetimeInput } from 'components';

import ButtonWithSpinner from 'components/button-with-spinner';
import { cityLoader, poiLoader } from 'utils/select-loaders';
import { RideBinding } from 'types/ride';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';

interface Props {
    isOpen: boolean,
    onChange(changed: Partial<RideBinding>): void,
    onClose(): void,
    onSave(): void,
}

const RideModal = ({ isOpen, onChange, onClose, onSave }: Props) => {
    const reactSelectStyles = useReactSelectStyles();
    return <Modal
        backdrop="static"
        show={isOpen}
        onHide={onClose}
        size="lg"
    >
        <Modal.Header closeButton>
            <Modal.Title>New ride</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Row>
                <Form.Group as={Col}>
                    <FormLabel>Origin city</FormLabel>
                    <AsyncSelect
                        defaultOptions
                        loadOptions={cityLoader}
                        onChange={x => onChange({ originCityId: x.value })}
                        styles={reactSelectStyles}
                    />
                </Form.Group>
                <Form.Group as={Col}>
                    <FormLabel>Origin point</FormLabel>
                    <AsyncSelect
                        defaultOptions
                        loadOptions={poiLoader}
                        onChange={x => onChange({ originPoiId: x.value })}
                        styles={reactSelectStyles}
                    />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col}>
                    <FormLabel>Destination city</FormLabel>
                    <AsyncSelect
                        defaultOptions
                        loadOptions={cityLoader}
                        onChange={x => onChange({ destinationCityId: x.value })}
                        styles={reactSelectStyles}
                    />
                </Form.Group>
                <Form.Group as={Col}>
                    <FormLabel>Destination point</FormLabel>
                    <AsyncSelect
                        defaultOptions
                        loadOptions={poiLoader}
                        onChange={x => onChange({ destinationPoiId: x.value })}
                        styles={reactSelectStyles}
                    />
                </Form.Group>
            </Form.Row>
            <FormGroup>
                <FormLabel>Departure</FormLabel>
                <DatetimeInput timeFormat="HH:mm" onChange={departure => onChange({ departure })} />
            </FormGroup>
            <FormGroup>
                <FormLabel>Arrival</FormLabel>
                <DatetimeInput timeFormat="HH:mm" onChange={arrival => onChange({ arrival })} />
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
};

export default RideModal;