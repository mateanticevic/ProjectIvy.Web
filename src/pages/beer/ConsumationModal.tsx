import React from 'react';
import FontAwesome from 'react-fontawesome';
import Datetime from 'react-datetime';
import { Modal, FormGroup, Button, ControlLabel, Glyphicon, InputGroup, FormControl } from 'react-bootstrap/lib';

import Select from '../../components/common/Select';

const ConsumationModal = (props) => {
    const { beers, brands, consumation, servings } = props;

    return (
        <Modal show={props.isOpen} onHide={props.onClose} bsSize="sm">
            <Modal.Header closeButton>
                <Modal.Title>New consumation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup>
                    <ControlLabel>Date</ControlLabel>
                    <InputGroup>
                        <Datetime
                            dateFormat="YYYY-MM-DD"
                            onChange={x => props.onChange({ date: x.format("YYYY-MM-DD") })}
                            timeFormat={false}
                            value={consumation.date} />
                        <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Brand</ControlLabel>
                    <Select options={brands} hideDefaultOption={true} onChange={props.onBrandChange} />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Beer</ControlLabel>
                    <Select options={beers} hideDefaultOption={true} onChange={x => props.onChange({ beerId: x })} />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Serving</ControlLabel>
                    <Select options={servings} hideDefaultOption={true} onChange={x => props.onChange({ servingId: x })} />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Volume</ControlLabel>
                    <InputGroup>
                        <FormControl type="number" onChange={x => props.onChange({ volume: x.target.value })} />
                        <InputGroup.Addon>ml</InputGroup.Addon>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Units</ControlLabel>
                    <FormControl type="number" onChange={x => props.onChange({ units: x.target.value })} />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button block bsStyle="primary" onClick={props.onSave}>
                    <FontAwesome name="save" /> Save
            </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConsumationModal;

ConsumationModal.propTypes = {
};