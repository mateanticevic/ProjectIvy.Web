import React from 'react';
import { Col, Form, FormGroup, FormLabel, Modal } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import Datetime from 'react-datetime';

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
};

export default RideModal;