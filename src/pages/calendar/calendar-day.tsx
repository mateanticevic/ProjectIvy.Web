import moment from 'moment';
import React from 'react';
import { Card } from 'react-bootstrap';

import Select from 'components/select';
import { components } from 'types/ivy-types';

type CalendarDay = components['schemas']['CalendarDay'];

interface Props {
    day: CalendarDay;
    offset?: number;
    onWorkDayTypeChange(workDayTypeId: string): void;
}

const workDayTypes = [
    { id: 'office', name: 'Office' },
    { id: 'remote', name: 'Remote' },
    { id: 'vacation', name: 'Vacation' },
];

export const CalendarDay = ({ day, offset, onWorkDayTypeChange }: Props) => {

    const momentDay = moment(day.date);

    const style = {
        '--offset': offset,
    };

    return (
        <Card className="calendar-item" style={style}>
            <Card.Header>{momentDay.format('Do ddd')}</Card.Header>
            <Card.Body>
                {day.isHoliday && 'Holiday'}
                {!day.isHoliday && momentDay.day() <= 5 && momentDay.day() != 0 &&
                    <Select
                        hideDefaultOption
                        options={workDayTypes}
                        defaultSelected={day.workDayType?.id ?? workDayTypes[0].id}
                        onChange={onWorkDayTypeChange}
                    />
                }
            </Card.Body>
        </Card>
    );
}