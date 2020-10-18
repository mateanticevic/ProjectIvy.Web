import React from 'react';
import moment from 'moment';

import { Card } from 'react-bootstrap';
import { RadioLabel, SimpleBarChart } from '.';
import { Unit } from '../consts/units';

const remap = (data) => {
    if (data[0]?.month) {
        return data.map(i => {
            return {
                key: moment(`${i.year}-${i.month}-1`).format('YYYY MMM'),
                value: i.data,
            };
        });
    }

    if (data[0]?.year) {
        return data.map(i => {
            return {
                key: i.year,
                value: i.data,
            };
        });
    }

    return data;
}

const unitMapping = {
    [Unit.Liters]: 'L',
};

export const DistributionCard = ({ countByOptions, data, name, unit, onGroupByChange }) => {
    const applyUnitFormatting = (data) => {
        if (unit == Unit.Liters){
            return data.map(x => {
                return {
                  key: x.key,
                  value: Math.round(x.value / 1000),  
                };
            });
        }

        return data;
    }

    return (
        <Card>
            <Card.Header>{name}</Card.Header>
            <Card.Body>
                <SimpleBarChart
                    data={applyUnitFormatting(remap(data))}
                    name="key"
                    unit={unit ? unitMapping[unit] : ''}
                    value="value"
                />
            </Card.Body>
            <Card.Footer>
                <RadioLabel options={countByOptions} onSelect={onGroupByChange} />
            </Card.Footer>
        </Card>
    );
}