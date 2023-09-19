import React from 'react';
import { FormLabel, FormControl, FormGroup, InputGroup, Modal } from 'react-bootstrap';
import Datetime from 'react-datetime';
import FontAwesome from 'react-fontawesome';
import AsyncSelect from 'react-select/async';
import { FaCalendar } from 'react-icons/fa';
import moment from 'moment';

import Select from 'components/select';
import { beerLoader } from 'utils/select-loaders';
import ButtonWithSpinner from 'components/button-with-spinner';
import { components } from 'types/ivy-types';

type Beer = components['schemas']['Beer'];
type BeerBrand = components['schemas']['BeerBrand'];
type BeerServing = components['schemas']['BeerServing'];
type Consumation = components['schemas']['Consumation'];

interface Props {
    beers: Beer[];
    brands: BeerBrand[];
    consumation: Consumation;
    disabled: boolean;
    isOpen: boolean;
    servings: BeerServing[];
    onChange(beerValue: Partial<Consumation>): void;
    onClose(): void;
    onSave(): void;
}

const ConsumationModal = ({ consumation, disabled, isOpen, onChange, onClose, onSave, servings }: Props) => {

    return (
        <Modal
            backdrop="static"
            show={isOpen}
            onHide={onClose}
            size="sm"
        >
            <Modal.Header closeButton>
                <Modal.Title>New consumation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <FormLabel>Date</FormLabel>
                    <InputGroup>
                        <Datetime
                            dateFormat="YYYY-MM-DD"
                            onChange={x => onChange({ date: moment(x).format('YYYY-MM-DD') })}
                            timeFormat={false}
                            value={consumation.date} />
                        <InputGroup.Text>
                            <FaCalendar />
                        </InputGroup.Text>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Beer</FormLabel>
                    <AsyncSelect
                        loadOptions={beerLoader}
                        onChange={x => onChange({ beerId: x.value })}
                        defaultOptions
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Serving</FormLabel>
                    <Select
                        options={servings}
                        hideDefaultOption={true}
                        onChange={servingId => onChange({ servingId })}
                    />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Volume</FormLabel>
                    <InputGroup>
                        <FormControl
                            disabled={disabled}
                            type="number"
                            onChange={x => onChange({ volume: parseInt(x.target.value) })}
                        />
                        <InputGroup.Text>ml</InputGroup.Text>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Units</FormLabel>
                    <FormControl
                        disabled={disabled}
                        type="number"
                        onChange={x => onChange({ units: parseInt(x.target.value) })}
                    />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <ButtonWithSpinner
                    isLoading={disabled}
                    onClick={onSave}
                >
                    <FontAwesome name="save" /> Save
                </ButtonWithSpinner>
            </Modal.Footer>
        </Modal>
    );
};

export default ConsumationModal;
