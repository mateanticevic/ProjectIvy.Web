import React from 'react';
import moment from 'moment';

import { Card } from 'react-bootstrap';
import { RadioLabel, SimpleBarChart } from '.';
import { Unit } from '../consts/units';
import { GroupByTime } from '../consts/groupings';

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
        if (unit == Unit.Liters) {
            return data.map(x => {
                return {
                    key: x.key,
                    value: Math.round(x.value / 1000),
                };
            });
        }

        return data;
    }

    const [countByOption, setCountByOption] = React.useState(countByOptions[0]);

    const groupByChange = (groupBy) => {
        setCountByOption(groupBy);
        onGroupByChange(groupBy);
    };

    let df = applyUnitFormatting(remap(data));
    if (countByOption === GroupByTime.ByDayOfWeek){
        df = df.map(x => {
            return {
                key: moment().day(x.key + 1).format("dddd"),
                value: x.value,
            };
        });
    }

    return (
        <Card>
            <Card.Header>{name}</Card.Header>
            <Card.Body>
                <SimpleBarChart
                    data={df}
                    name="key"
                    unit={unit ? unitMapping[unit] : ''}
                    value="value"
                />
            </Card.Body>
            <Card.Footer>
                <RadioLabel
                    options={countByOptions}
                    onSelect={groupByChange}
                />
            </Card.Footer>
        </Card>
    );
}