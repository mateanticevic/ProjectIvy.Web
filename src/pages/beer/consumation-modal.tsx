import React, { useState } from 'react';
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
import { SelectOption } from 'types/common';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';

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

enum Unit {
    Ml = 'ml',
    Oz = 'oz',
    ImperialPint = 'imperialPint',
    UsPint = 'usPint',
    AuPint = 'auPint',
};

const units: SelectOption[] = [
    { name: 'ml', id: Unit.Ml },
    { name: 'oz', id: Unit.Oz },
    { name: 'pint (UK)', id: Unit.ImperialPint },
    { name: 'pint (AU)', id: Unit.AuPint },
    { name: 'pint (US)', id: Unit.UsPint },
];

const convertToMl = (volume: number, selectedUnit: Unit) => {
    switch (selectedUnit) {
        case Unit.Ml:
            return volume;
        case Unit.Oz:
            return volume * 29.5735;
        case Unit.ImperialPint:
            return volume * 568.261;
        case Unit.AuPint:
            return volume * 570;
        case Unit.UsPint:
            return volume * 473.176;
    }
}

const ConsumationModal = ({ consumation, disabled, isOpen, onChange, onClose, onSave, servings }: Props) => {

    const [ selectedUnit, setUnit ] = useState(Unit.Ml);
    const [ volume, setVolume ] = useState(0);
    const reactSelectStyles = useReactSelectStyles();

    const isPintSelected = selectedUnit === Unit.ImperialPint || selectedUnit === Unit.UsPint || selectedUnit === Unit.AuPint;

    const setConsumationVolume = (newVolume?: number, newUnit?: Unit) => {
        if (newVolume !== undefined) {
            const unitToUse = newUnit || selectedUnit;
            onChange({ volume: Math.round(convertToMl(newVolume, unitToUse)) });
            setVolume(newVolume);
            if (newUnit) {
                setUnit(newUnit);
            }
        }
        else if (newUnit) {
            setUnit(newUnit);
            const isPint = newUnit === Unit.ImperialPint || newUnit === Unit.UsPint || newUnit === Unit.AuPint;
            const volumeToUse = isPint ? 1 : volume;
            if (isPint || volume > 0) {
                onChange({ volume: Math.round(convertToMl(volumeToUse, newUnit)) });
                if (isPint) {
                    setVolume(1);
                }
            }
        }
    };

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
                        styles={reactSelectStyles}
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
                            disabled={disabled || isPintSelected}
                            type="number"
                            value={isPintSelected ? 1 : volume || ''}
                            onChange={x => setConsumationVolume(parseInt(x.target.value), undefined)}
                        />
                        <InputGroup.Text><Select
                            options={units}
                            hideDefaultOption={true}
                            onChange={selectedUnit => setConsumationVolume(undefined, selectedUnit as Unit)}
                        /></InputGroup.Text>
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
