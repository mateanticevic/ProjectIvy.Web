import React from 'react';
import { Card, FormGroup, FormLabel } from 'react-bootstrap';
import Slider from 'rc-slider';

import { DatetimeInput, Select } from 'components';
import { MovieFilters } from 'types/movies';

interface Props {
    filters: MovieFilters;
    onFiltersChanged(changed: Partial<MovieFilters>): void;
}

const orderByOptions = [
    { id: 'rating', name: 'Rating' },
    { id: 'myRating', name: 'My Rating' },
    { id: 'myRatingDifference', name: 'My Rating Difference' },
];

export const FilterCard = ({ filters, onFiltersChanged }: Props) =>
    <Card>
        <Card.Header>Filters</Card.Header>
        <Card.Body>
            <FormGroup>
                <FormLabel>From</FormLabel>
                <DatetimeInput
                    value={filters.from}
                    onChange={from => onFiltersChanged({ from })}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>To</FormLabel>
                <DatetimeInput
                    value={filters.to}
                    onChange={to => onFiltersChanged({ to })}
                />
            </FormGroup>
            <FormGroup className="margin-bottom-30">
                <FormLabel>Rating</FormLabel>
                <Slider
                    max={10}
                    marks={{
                        1: '1',
                        10: '10',
                    }}
                    min={1}
                    onChange={c => onFiltersChanged({ ratingLower: c[1], ratingHigher: c[0] })}
                    range
                    step={0.1}
                    value={[filters.ratingHigher, filters.ratingLower]}
                />
            </FormGroup>
            <FormGroup className="margin-bottom-30">
                <FormLabel>Runtime</FormLabel>
                <Slider
                    max={300}
                    marks={{
                        1: '1m',
                        300: '5h',
                    }}
                    min={1}
                    onChange={c => onFiltersChanged({ runtimeShorter: c[1], runtimeLonger: c[0] })}
                    range
                    step={1}
                    value={[filters.runtimeLonger, filters.runtimeShorter]}
                />
            </FormGroup>
            <FormGroup>
                <FormLabel>Order By</FormLabel>
                <Select
                    options={orderByOptions}
                    onChange={orderBy => onFiltersChanged({ orderBy })}
                />
            </FormGroup>
        </Card.Body>
    </Card>;