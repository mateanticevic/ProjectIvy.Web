import React from 'react';
import { Button, FormLabel, FormControl, FormGroup, InputGroup, Modal } from 'react-bootstrap';
import Datetime from 'react-datetime';
import FontAwesome from 'react-fontawesome';
import AsyncSelect from 'react-select/async';
import { FaCalendar } from 'react-icons/fa';

import { Beer, Brand, Consumation, Serving } from 'types/beer';
import Select from '../../components/Select';
import { beerLoader } from '../../utils/selectLoaders';
import ButtonWithSpinner from '../../components/ButtonWithSpinner';

interface Props {
    beers: Beer[];
    brands: Brand[];
    consumation: Consumation;
    disabled: boolean;
    isOpen: boolean;
    servings: Serving[];
    onBrandChange(brandId: string): void;
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
                            onChange={x => onChange({ date: x.format('YYYY-MM-DD') })}
                            timeFormat={false}
                            value={consumation.date} />
                        <InputGroup.Append>
                            <InputGroup.Text>
                                <FaCalendar />
                            </InputGroup.Text>
                        </InputGroup.Append>
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
                    <Select options={servings} hideDefaultOption={true} onChange={servingId => onChange({ servingId })} />
                </FormGroup>
                <FormGroup>
                    <FormLabel>Volume</FormLabel>
                    <InputGroup>
                        <FormControl
                            disabled={disabled}
                            type="number"
                            onChange={x => onChange({ volume: x.target.value })}
                        />
                        <InputGroup.Append>
                            <InputGroup.Text>ml</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Units</FormLabel>
                    <FormControl
                        disabled={disabled}
                        type="number"
                        onChange={x => onChange({ units: x.target.value })}
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

ConsumationModal.propTypes = {
};
