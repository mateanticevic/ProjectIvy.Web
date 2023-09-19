import React from 'react';
import { FormLabel, FormGroup } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';

import { DateFormElement } from 'components';
import Select from 'components/select';
import { beerLoader } from 'utils/select-loaders';
import { ConsumationFilters } from 'types/beer';
import { Country } from 'types/common';
import { components } from 'types/ivy-types';

type BeerBrand = components['schemas']['BeerBrand'];
type BeerServing = components['schemas']['BeerServing'];
type BeerStyle = components['schemas']['BeerStyle'];

interface Props {
    brands: BeerBrand[];
    countries: Country[];
    filters: ConsumationFilters;
    servings: BeerServing[];
    styles: BeerStyle[];
    onChange: (changed: Partial<ConsumationFilters>) => void;
}

export const Filters = ({ brands, countries, filters, onChange, servings, styles }: Props) =>
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
                onChange={brandId => onChange({ brandId })}
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
            <FormLabel>Country</FormLabel>
            <Select
                onChange={countryId => onChange({ countryId })}
                options={countries}
                selected={filters.countryId}
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
        <FormGroup>
            <FormLabel>Style</FormLabel>
            <Select
                onChange={x => onChange({ styleId: x })}
                options={styles}
                selected={filters.styleId}
            />
        </FormGroup>
    </React.Fragment>;
