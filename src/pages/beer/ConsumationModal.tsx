import React from 'react';
import { Button, FormLabel, FormControl, FormGroup, InputGroup, Modal } from 'react-bootstrap';
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
                            {/* <Glyphicon glyph="calendar" /> */}
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
                        <FormControl type="number" onChange={x => onChange({ volume: x.target.value })} />
                        <InputGroup.Append>ml</InputGroup.Append>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <FormLabel>Units</FormLabel>
                    <FormControl type="number" onChange={x => onChange({ units: x.target.value })} />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button block variant="primary" onClick={onSave}>
                    <FontAwesome name="save" /> Save
            </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConsumationModal;

ConsumationModal.propTypes = {
};
