import React from 'react';
import { Modal, FormGroup, Button, ControlLabel, Glyphicon, InputGroup, FormControl } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';

import Select from '../common/Select';

const ConsumationFilters = props => {

    return (
        <React.Fragment>
            <FormGroup>
                <ControlLabel>From</ControlLabel>
                <InputGroup>
                    <Datetime
                        defaultValue={new Date()}
                        dateFormat="YYYY-MM-DD"
                        timeFormat={false}
                        onChange={x => props.onChange({ from: x.format("YYYY-MM-DD") })} />
                    <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <ControlLabel>To</ControlLabel>
                <InputGroup>
                    <Datetime
                        defaultValue={new Date()}
                        dateFormat="YYYY-MM-DD"
                        timeFormat={false}
                        onChange={x => props.onChange({ to: x.format("YYYY-MM-DD") })} />
                    <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <ControlLabel>Brand</ControlLabel>
                <Select options={props.brands} hideDefaultOption={true} onChange={id => props.onChange({ brandId: id })} />
            </FormGroup>
        </React.Fragment>
    );
};

export default ConsumationFilters;