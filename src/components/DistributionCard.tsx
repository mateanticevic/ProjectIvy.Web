import React from 'react';
import moment from 'moment';

import { Card } from 'react-bootstrap';
import { RadioLabel, SimpleBarChart } from '.';
import { Unit } from '../consts/units';
import { GroupByTime } from '../consts/groupings';

const remap = (data) => {
    if (!data){
        return data;
    }

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
};

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

    const applyKeyFormatting = {
        [GroupByTime.ByDayOfWeek]: (key) => moment().day(key + 1).format("dddd"),
        [GroupByTime.ByMonth]: (key) => moment().month(key - 1).format("MMMM"),
        [GroupByTime.ByMonthOfYear]: (key) => moment(key).format("MMM YYYY"),
    };

    const [countByOption, setCountByOption] = React.useState(countByOptions[0].value);

    const groupByChange = (groupBy) => {
        setCountByOption(groupBy);
        onGroupByChange(groupBy);
    };

    let df = applyUnitFormatting(remap(data));
    if (applyKeyFormatting[countByOption]){
        df = df.map(x => {
            return {
                key: applyKeyFormatting[countByOption](x.key),
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