import React from 'react';
import { Button, ControlLabel, FormControl, FormGroup, Glyphicon, InputGroup, Modal } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';
import FontAwesome from 'react-fontawesome';
import AsyncSelect from 'react-select/async';

import { Beer, Brand, Consumation, Serving } from 'types/beer';
import Select from '../../components/Select';
import { beerLoader } from '../../utils/selectLoaders';

interface Props {
    beers: Beer[];
    brands: Brand[];
    consumation: Consumation;
    isOpen: boolean;
    servings: Serving[];
    onBrandChange(brandId: string): void;
    onChange(beerValue: Partial<Consumation>): void;
    onClose(): void;
    onSave(): void;
}

const ConsumationModal = ({ consumation, isOpen, onChange, onClose, onSave, servings }: Props) => {

    return (
        <Modal show={isOpen} onHide={onClose} bsSize="sm">
            <Modal.Header closeButton>
                <Modal.Title>New consumation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <ControlLabel>Date</ControlLabel>
                    <InputGroup>
                        <Datetime
                            dateFormat="YYYY-MM-DD"
                            onChange={x => onChange({ date: x.format('YYYY-MM-DD') })}
                            timeFormat={false}
                            value={consumation.date} />
                        <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Beer</ControlLabel>
                    <AsyncSelect
                        loadOptions={beerLoader}
                        onChange={x => onChange({ beerId: x.value })}
                        defaultOptions
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Serving</ControlLabel>
                    <Select options={servings} hideDefaultOption={true} onChange={servingId => onChange({ servingId })} />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Volume</ControlLabel>
                    <InputGroup>
                        <FormControl type="number" onChange={x => onChange({ volume: x.target.value })} />
                        <InputGroup.Addon>ml</InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Units</ControlLabel>
                    <FormControl type="number" onChange={x => onChange({ units: x.target.value })} />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button block bsStyle="primary" onClick={onSave}>
                    <FontAwesome name="save" /> Save
            </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConsumationModal;

ConsumationModal.propTypes = {
};
