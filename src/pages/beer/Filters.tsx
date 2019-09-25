import React from 'react';
import { ControlLabel, FormGroup, Glyphicon, InputGroup } from 'react-bootstrap/lib';
import Datetime from 'react-datetime';
import AsyncSelect from 'react-select/async';

import Select from '../../components/Select';
import { beerLoader } from '../../utils/selectLoaders';

type Props = {
    brands: any;
    filters: any;
    servings: any;
    onChange: any;
}

const Filters = ({ brands, filters, onChange, servings }: Props) => {

    return (
        <React.Fragment>
            <FormGroup>
                <ControlLabel>From</ControlLabel>
                <InputGroup>
                    <Datetime
                        dateFormat="YYYY-MM-DD"
                        timeFormat={false}
                        onChange={(x) => onChange({ from: x.format('YYYY-MM-DD') })}
                        value={filters.from} />
                    <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <ControlLabel>To</ControlLabel>
                <InputGroup>
                    <Datetime
                        dateFormat="YYYY-MM-DD"
                        timeFormat={false}
                        onChange={(x) => onChange({ to: x.format('YYYY-MM-DD') })} />
                    <InputGroup.Addon><Glyphicon glyph="calendar" /></InputGroup.Addon>
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <ControlLabel>Brand</ControlLabel>
                <Select options={brands} onChange={(id) => onChange({ brandId: id })} />
            </FormGroup>
            <FormGroup>
                <ControlLabel>Beer</ControlLabel>
                <AsyncSelect
                    loadOptions={beerLoader}
                    onChange={(x) => onChange({ beerId: x.value })}
                    defaultOptions
                />
            </FormGroup>
            <FormGroup>
                <ControlLabel>Serving</ControlLabel>
                <Select options={servings} onChange={(x) => onChange({ serving: x })} />
            </FormGroup>
        </React.Fragment>
    );
};

export default Filters;
