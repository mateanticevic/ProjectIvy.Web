import React from 'react';
import moment from 'moment';

import { Card } from 'react-bootstrap';
import { RadioLabel, SimpleBarChart } from '.';
import { Unit } from '../consts/units';
import { GroupByTime } from '../consts/groupings';

const remap = (data) => {
    if (!data) {
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
    [Unit.Volume]: 'L',
};

interface Props {
    unit?: string;
    unitType?: Unit;
    countByOptions?(): void;
    onGroupByChange?(): void;
}

export const DistributionCard = ({ countByOptions, data, name, unit, unitType, onGroupByChange }: Props) => {
    const applyUnitFormatting = (data) => {
        if (unitType == Unit.Volume) {
            return data.map(x => {
                return {
                    key: x.key,
                    value: Math.round(x.value / 1000),
                };
            });
        }

        return data;
    };

    const applyKeyFormatting = {
        [GroupByTime.ByDayOfWeek]: (key) => moment().day(key + 1).format('dddd'),
        [GroupByTime.ByMonth]: (key) => moment().month(key - 1).format('MMMM'),
        [GroupByTime.ByMonthOfYear]: (key) => moment(key).format('MMM YYYY'),
    };

    const [groupByOption, setGroupByOption] = React.useState(countByOptions ? countByOptions[0].value : null);

    const groupByChange = (groupBy) => {
        setGroupByOption(groupBy);
        onGroupByChange && onGroupByChange(groupBy);
    };

    let df = applyUnitFormatting(remap(data));
    if (applyKeyFormatting[groupByOption]) {
        df = df.map(x => {
            return {
                key: applyKeyFormatting[groupByOption](x.key),
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
                    unit={unitType ? unitMapping[unitType] : unit ?? ''}
                    value="value"
                />
            </Card.Body>
            <Card.Footer>
                {countByOptions &&
                    <RadioLabel
                        options={countByOptions}
                        onSelect={groupByChange}
                    />
                }
            </Card.Footer>
        </Card>
    );
};
