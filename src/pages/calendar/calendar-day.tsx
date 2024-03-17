import moment from 'moment';
import React from 'react';
import { Card } from 'react-bootstrap';

import Select from 'components/select';
import { components } from 'types/ivy-types';
import classNames from 'classnames';

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

    const classes = classNames('calendar-item', {
        'weekend': (momentDay.day() === 0 || momentDay.day() === 6) && !day.isHoliday,
        'holiday': day.isHoliday,
        'vacation': day.workDayType?.id === 'vacation' && !day.isHoliday,
    });

    return (
        <Card className={classes} style={style}>
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
                {day.countries?.filter(c => c.id !== 'HR').map(country =>
                    <span className={`flag-icon flag-icon-${country.id?.toLowerCase()} country-flag`} />
                )}
            </Card.Body>
        </Card>
    );
}