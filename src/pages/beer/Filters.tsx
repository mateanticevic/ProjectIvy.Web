import React from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap/lib';
import AsyncSelect from 'react-select/async';

import Select from '../../components/Select';
import { beerLoader } from '../../utils/selectLoaders';
import { DateFormElement } from '../../components';

type Props = {
    brands: any;
    filters: any;
    servings: any;
    onChange: any;
}

const Filters = ({ brands, filters, onChange, servings }: Props) => {

    return (
        <React.Fragment>
            <DateFormElement
                label="From"
                onChange={date => onChange({ from: date })}
                value={filters.from}
            />
            <DateFormElement
                label="To"
                onChange={date => onChange({ to: date })}
                value={filters.to}
            />
            <FormGroup>
                <ControlLabel>Brand</ControlLabel>
                <Select options={brands} onChange={id => onChange({ brandId: id })} />
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
                <Select options={servings} onChange={x => onChange({ serving: x })} />
            </FormGroup>
        </React.Fragment>
    );
};

export default Filters;
