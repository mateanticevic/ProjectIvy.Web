import React from 'react';
import { FormLabel, FormGroup } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';

import { DateFormElement } from '../../components';
import Select from '../../components/Select';
import { beerLoader } from '../../utils/selectLoaders';

interface Props {
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
                <FormLabel>Brand</FormLabel>
                <Select
                    onChange={id => onChange({ brandId: id })}
                    options={brands}
                    selected={filters.brandId}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Beer</FormLabel>
                <AsyncSelect
                    defaultOptions
                    loadOptions={beerLoader}
                    onChange={x => onChange({ beerId: x.value })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Serving</FormLabel>
                <Select
                    onChange={x => onChange({ serving: x })}
                    options={servings}
                    selected={filters.serving}
                />
            </FormGroup>
        </React.Fragment>
    );
};

export default Filters;
