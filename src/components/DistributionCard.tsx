import React from 'react';
import moment from 'moment';

import { Card } from 'react-bootstrap';
import { RadioLabel, SimpleBarChart } from '.';

const remap = (data) => {
    if (data[0]?.month){
        return data.map(i => {
            return {
                key: moment(`${i.year}-${i.month}-1`).format('YYYY MMM'),
                value: i.data,
            };
        });
    }

    if (data[0]?.year){
        return data.map(i => {
            return {
                key: i.year,
                value: i.data,
            };
        });
    }

    return data;
}

export const DistributionCard = ({ countByOptions, data, onGroupByChange }) => {

    return (
        <Card>
            <Card.Header>Count</Card.Header>
            <Card.Body>
                <SimpleBarChart
                    data={remap(data)}
                    name="key"
                    value="value"
                />
            </Card.Body>
            <Card.Footer>
                <RadioLabel options={countByOptions} onSelect={onGroupByChange} />
            </Card.Footer>
        </Card>
    );
}