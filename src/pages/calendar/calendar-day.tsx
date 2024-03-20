import moment from 'moment';
import React from 'react';
import { Card } from 'react-bootstrap';

import Select from 'components/select';
import { components } from 'types/ivy-types';
import classNames from 'classnames';
import { SelectOption } from 'types/common';

type CalendarDay = components['schemas']['CalendarDay'];

interface Props {
    day: CalendarDay;
    offset?: number;
    onWorkDayTypeChange(workDayType: SelectOption): void;
}

const workDayTypes = [
    { id: 'office', name: 'Office' },
    { id: 'remote', name: 'Remote' },
    { id: 'vacation', name: 'Vacation' },
    { id: 'sick-leave', name: 'Sick leave' },
];

export const CalendarDay = ({ day, offset, onWorkDayTypeChange }: Props) => {

    const changeWorkDayType = (workDayTypeId: string) => {
        setIsEdit(false);
        onWorkDayTypeChange(workDayTypes.find(w => w.id === workDayTypeId)!);
    }

    const momentDay = moment(day.date);

    const isWeekend = momentDay.day() === 0 || momentDay.day() === 6;

    const style = {
        '--offset': offset,
    };

    const classes = classNames('calendar-item', {
        'holiday': day.isHoliday,
        'today': momentDay.isSame(moment(), 'day'),
        'vacation': day.workDayType?.id === 'vacation' && !day.isHoliday,
        'weekend': (momentDay.day() === 0 || momentDay.day() === 6) && !day.isHoliday,
    });

    const [isEdit, setIsEdit] = React.useState<boolean>(false);

    return (
        <Card className={classes} style={style}>
            <Card.Header>{momentDay.format('Do ddd')}</Card.Header>
            <Card.Body>
                {day.isHoliday && 'Holiday'}
                {isEdit && !day.isHoliday && !isWeekend &&
                    <Select
                        hideDefaultOption
                        options={workDayTypes}
                        defaultSelected={day.workDayType?.id ?? workDayTypes[0].id}
                        onChange={changeWorkDayType}
                    />
                }
                {!isEdit && !day.isHoliday && !isWeekend &&
                    <span onClick={() => setIsEdit(true)}>
                        {day.workDayType?.name ?? workDayTypes[0].name}
                    </span>
                }
                {day.countries?.filter(c => c.id !== 'HR').map(country =>
                    <span className={`flag-icon flag-icon-${country.id?.toLowerCase()} country-flag`} />
                )}
            </Card.Body>
        </Card>
    );
}