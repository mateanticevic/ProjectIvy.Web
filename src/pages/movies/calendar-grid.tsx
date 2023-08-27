import React from 'react';
import _ from 'lodash';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import CalendarHeatmap from 'react-calendar-heatmap';

import { KeyValuePair } from 'types/grouping';

interface Props {
    dates: KeyValuePair<number>[];
}

const valueToClass = (value) => {
    if (!value)
        return 'background-inactive';

    if (value.count > 4)
        return 'fill-count-5';

    return `fill-count-${value.count}`;
};

const CalendarGrid = ({ dates }: Props) => {

    const countByYears = Object.entries(_.groupBy(dates, x => new Date(x.key).getFullYear()));

    const [year, setYear] = React.useState(2021);

    const changeYear = (year: number) => {
        setYear(year);
    };

    return (
        <React.Fragment>
            <ToggleButtonGroup className="margin-bottom-30" type="radio" name="options" value={year} onChange={changeYear}>
                {countByYears.map(([key]) =>
                    <ToggleButton id={key} key={key} value={key}>{key}</ToggleButton>
                )}
            </ToggleButtonGroup>
            <CalendarHeatmap
                startDate={new Date(`${year}-1-1`)}
                endDate={new Date(`${year}-12-31`)}
                values={dates.map(value => {
                    return {
                        count: value.value,
                        date: new Date(value.key),
                    };
                })}
                classForValue={valueToClass}
                titleForValue={value => value ? `On ${value.date.toDateString()}, watched ${value.count}` : undefined}
                showMonthLabels={false}
            />
        </React.Fragment>
    );
};

export default CalendarGrid;