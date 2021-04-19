import React from 'react';
import _ from 'lodash';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import CalendarHeatmap from 'react-calendar-heatmap';

interface Props {
    dates: string[];
    onDateClick(date: string): void;
}

const CalendarGrid = ({ dates, onDateClick }: Props) => {

    const countByYears = Object.entries(_.groupBy(dates, x => new Date(x).getFullYear()));

    const [year, setYear] = React.useState(2021);

    const changeYear = (year: number) => {
        setYear(year);
    };

    return (
        <React.Fragment>
            <ToggleButtonGroup className="margin-bottom-30" type="radio" name="options" value={year} onChange={changeYear}>
                {countByYears.map(([key, value]) =>
                    <ToggleButton key={key} value={key}>{`${key} (${value.length})`}</ToggleButton>
                )}
            </ToggleButtonGroup>
            <CalendarHeatmap
                startDate={new Date(`${year}-1-1`)}
                endDate={new Date(`${year}-12-31`)}
                values={dates.map(value => {
                    return {
                        date: new Date(value),
                        value
                    };
                })}
                classForValue={value => value ? 'background-active' : 'background-inactive'}
                titleForValue={value => value ? value.date.toDateString() : undefined}
                showMonthLabels={false}
                onClick={value => onDateClick(value.value)}
            />
        </React.Fragment>
    );
};

export default CalendarGrid;