import React from 'react';
import { Modal, Button, FormGroup, FormLabel } from 'react-bootstrap';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';
import { DateFormElement } from 'components';
import { cityLoader } from 'utils/select-loaders';
import { components } from 'types/ivy-types';

type StayBinding = components['schemas']['StayBinding'];

interface Props {
    buttonIsLoading: boolean;
    isOpen: boolean;
    onClose: () => void;
    onChange: (stay: Partial<StayBinding>) => void;
    onSave: () => void;
    countries: any[];
}

const StayModal: React.FC<Props> = ({ buttonIsLoading, isOpen, onClose, onChange, onSave, countries }) => {
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Stay</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DateFormElement
                    label="Date"
                    onChange={date => onChange({ date })}
                />
                <FormGroup>
                    <FormLabel>Country</FormLabel>
                    <ReactSelect
                        options={countries.map(x => ({ value: x.id, label: x.name }))}
                        onChange={country => onChange({ countryId: country?.value || null })}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>City</FormLabel>
                    <AsyncSelect
                        defaultOptions
                        loadOptions={cityLoader}
                        onChange={city => onChange({ cityId: city?.value || null })}
                    />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button 
                    variant="primary" 
                    onClick={onSave}
                    disabled={buttonIsLoading}
                >
                    {buttonIsLoading ? 'Saving...' : 'Save Stay'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StayModal;
