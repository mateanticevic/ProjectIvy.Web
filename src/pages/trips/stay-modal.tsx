import React from 'react';
import { Modal, Button, FormGroup, FormLabel } from 'react-bootstrap';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/async';
import { DateFormElement } from 'components';
import { cityLoader } from 'utils/select-loaders';
import { components } from 'types/ivy-types';
import moment from 'moment';

type StayBinding = components['schemas']['StayBinding'];
type Stay = components['schemas']['Stay'];

interface Props {
    buttonIsLoading: boolean;
    isOpen: boolean;
    stay?: Stay | null;
    onClose: () => void;
    onChange: (stay: Partial<Stay>) => void;
    onSave: () => void;
    countries: any[];
}

const StayModal: React.FC<Props> = ({ buttonIsLoading, isOpen, stay, onClose, onChange, onSave, countries }) => {
    const isEditing = !!stay;

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Edit Stay' : 'Add Stay'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DateFormElement
                    label="From"
                    value={moment(stay?.from).format('YYYY-MM-DD')}
                    onChange={from => onChange({ from })}
                />
                <DateFormElement
                    label="To"
                    value={(stay?.to ? moment(stay.to) : moment()).add(1, 'days').format('YYYY-MM-DD')}
                    onChange={to => onChange({ to })}
                />
                <FormGroup>
                    <FormLabel>Country</FormLabel>
                    <ReactSelect
                        isDisabled={stay?.city != null}
                        options={countries.map(x => ({ value: x.id, label: x.name }))}
                        value={stay?.country ? { value: stay.country.id, label: stay.country.name } : null}
                        onChange={country => onChange({ country: { id: country?.value, name: country?.label } })}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>City</FormLabel>
                    <AsyncSelect
                        defaultOptions
                        loadOptions={cityLoader}
                        value={stay?.city ? { value: stay.city.id, label: stay.city.name } : null}
                        onChange={city => onChange({ city: { id: city?.value, name: city?.label } })}
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
                    {buttonIsLoading ? 'Saving...' : isEditing ? 'Update Stay' : 'Save Stay'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default StayModal;
