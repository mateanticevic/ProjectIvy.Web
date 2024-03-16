import moment from 'moment';
import React from 'react';
import { Card } from 'react-bootstrap';

import Select from 'components/select';
import { components } from 'types/ivy-types';

type CalendarDay = components['schemas']['CalendarDay'];

interface Props {
    day: CalendarDay;
    onWorkDayTypeChange(workDayTypeId: string): void;
}

const workDayTypes = [
    { id: 'office', name: 'Office' },
    { id: 'remote', name: 'Remote' },
    { id: 'vacation', name: 'Vacation' },
];

export const CalendarDay = ({ day, onWorkDayTypeChange }: Props) => {

    const momentDay = moment(day.date);

    return (
        <Card>
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