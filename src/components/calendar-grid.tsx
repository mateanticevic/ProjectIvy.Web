import React from 'react';
import _ from 'lodash';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import CalendarHeatmap from 'react-calendar-heatmap';

import { KeyValuePair } from 'types/grouping';

interface Props {
    dates: KeyValuePair<number>[] | string[];
    renderTooltip?: (date: string, value: number) => string; 
}

const booleanValueToClass = (value) => value?.count === 1 ? 'background-active' : 'background-inactive';

const valueToClass = (value) => {
    if (!value)
        return 'background-inactive';

    if (value.count > 4)
        return 'fill-count-5';

    return `fill-count-${value.count}`;
};

const CalendarGrid = ({ dates, renderTooltip }: Props) => {

    if (dates.length === 0) {
        return <></>;
    }

    const booleanValues = typeof dates[0] === 'string';

    const keyValuePairs = booleanValues ? dates.map(x => {
        const o: KeyValuePair<number> = {
            key: x,
            value: 1,
        };
        return o;
    }) : dates as KeyValuePair<number>[];

    const countByYears = Object.entries(_.groupBy(keyValuePairs, x => new Date(x.key).getFullYear()));
    console.log(countByYears);

    const [year, setYear] = React.useState(countByYears[countByYears.length - 1][0]);

    React.useEffect(() => setYear(countByYears[countByYears.length - 1][0]), dates);

    return (
        <React.Fragment>
            <ToggleButtonGroup className="margin-bottom-30" type="radio" name="options" value={year} onChange={setYear}>
                {countByYears.map(([key]) =>
                    <ToggleButton id={key} key={key} value={key}>{key}</ToggleButton>
                )}
            </ToggleButtonGroup>
            <CalendarHeatmap
                startDate={new Date(`${year}-1-1`)}
                endDate={new Date(`${year}-12-31`)}
                values={keyValuePairs.map(keyValuePair => {
                    return {
                        count: keyValuePair.value,
                        date: new Date(keyValuePair.key),
                    };
                })}
                classForValue={booleanValues ? booleanValueToClass : valueToClass}
                titleForValue={value => value ? (renderTooltip ? renderTooltip(value.date.toDateString(), value.count) : value.date.toDateString()) : undefined}
                showMonthLabels={false}
            />
        </React.Fragment>
    );
};

export default CalendarGrid;