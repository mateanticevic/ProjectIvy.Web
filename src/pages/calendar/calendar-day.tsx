import moment from 'moment';
import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

import Select from 'components/select';
import { components } from 'types/ivy-types';
import classNames from 'classnames';
import { SelectOption } from 'types/common';
import { WorkDayTypeIcon } from './work-day-type-icon';
import { MdOutlineAirplanemodeActive } from 'react-icons/md';
import { IoMdHome } from 'react-icons/io';

type CalendarDay = components['schemas']['CalendarDay'];
type Flight = components['schemas']['Flight'];
type Location = components['schemas']['Location'];

interface Props {
    day: CalendarDay;
    flights: Flight[];
    locations: Location[];
    offset?: number;
    onShowMap?(): void;
    onWorkDayTypeChange(workDayType: SelectOption): void;
}

const workDayTypes = [
    { id: 'office', name: 'Office' },
    { id: 'remote', name: 'Remote' },
    { id: 'vacation', name: 'Vacation' },
    { id: 'sick-leave', name: 'Sick leave' },
    { id: 'business-trip', name: 'Business trip' },
];

export const CalendarDay = ({ day, flights, locations, offset, onWorkDayTypeChange, onShowMap }: Props) => {

    const changeWorkDayType = (workDayTypeId: string) => {
        setIsEdit(false);
        onWorkDayTypeChange(workDayTypes.find(w => w.id === workDayTypeId)!);
    }

    const momentDay = moment(day.date);

    const isWeekend = momentDay.day() === 0 || momentDay.day() === 6;
    const isWorkingDay = !isWeekend && !day.isHoliday && day.workDayType?.id !== 'vacation' && day.workDayType?.id !== 'sick-leave' && day.workDayType?.id !== 'business-trip';

    const style = {
        '--offset': offset,
    };

    const classes = classNames('calendar-item', {
        'holiday': day.isHoliday,
        'today': momentDay.isSame(moment(), 'day'),
        'vacation': day.workDayType?.id === 'vacation' && !day.isHoliday,
        'weekend': isWeekend && !day.isHoliday,
        'working-day': isWorkingDay,
    });

    const places = locations.concat(flights.map(f => ({ name: `${f.origin?.iata} -> ${f.destination?.iata}`, id: f.destination?.iata })) ?? [])
                            .concat(day.countries?.map(c => ({ name: c.name, id: c.id })) ?? []).reverse();

    const [isEdit, setIsEdit] = React.useState<boolean>(false);

    return (
        <Card
            className={classes}
            style={style}
        >
            <Card.Header onClick={onShowMap}>{momentDay.format('Do ddd')}</Card.Header>
            <Card.Body>
                <ListGroup>
                    {places.filter(c => c.id !== 'HR').map(place =>
                        <ListGroup.Item key={place.id}>
                            {place.id?.length === 2 && <span className={`flag-icon flag-icon-${place.id?.toLowerCase()}`} />}
                            {place.id?.length === 3 && <MdOutlineAirplanemodeActive />}
                            {place.id?.length > 3 && <IoMdHome />} {place.name}
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Card.Body>
            <Card.Footer>
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
                        <WorkDayTypeIcon id={day.workDayType?.id} />
                    </span>
                }
            </Card.Footer>
        </Card>
    );
}