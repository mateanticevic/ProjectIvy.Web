import React from 'react';
import { FormGroup, ControlLabel, Glyphicon, InputGroup } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';

import Select from '../common/Select';

const ConsumationFilters = props => {

    return (
        <React.Fragment>
            <FormGroup>
                <ControlLabel>From</ControlLabel>
                <InputGroup>
                    <Datetime
                        dateFormat="YYYY-MM-DD"
                        timeFormat={false}
                        onChange={x => props.onChange({ from: x.format("YYYY-MM-DD") })}
                        value={props.filters.from} />
                    <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <ControlLabel>To</ControlLabel>
                <InputGroup>
                    <Datetime
                        dateFormat="YYYY-MM-DD"
                        timeFormat={false}
                        onChange={x => props.onChange({ to: x.format("YYYY-MM-DD") })} />
                    <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <ControlLabel>Brand</ControlLabel>
                <Select options={props.brands} onChange={id => props.onChange({ brandId: id })} />
            </FormGroup>
            <FormGroup>
                <ControlLabel>Serving</ControlLabel>
                <Select options={props.servings} onChange={x => props.onChange({ serving: x })} />
            </FormGroup>
        </React.Fragment>
    );
};

export default ConsumationFilters;