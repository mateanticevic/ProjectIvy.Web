import moment from 'moment';
import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';

import Select from 'components/select';
import { components } from 'types/ivy-types';
import classNames from 'classnames';
import { SelectOption } from 'types/common';
import { WorkDayType, WorkDayTypeIcon } from './work-day-type-icon';
import CalendarDaySubitems from './calendar-day-subitems';
import { FaRoute } from 'react-icons/fa';

type CalendarDay = components['schemas']['CalendarDay'];
type Flight = components['schemas']['Flight'];
type Movie = components['schemas']['Movie'];

interface Props {
    day: CalendarDay;
    flights: Flight[];
    movies: Movie[];
    offset?: number;
    onShowMap?(): void;
    onWorkDayTypeChange(workDayType: SelectOption): void;
}

const workDayTypes = [
    { id: WorkDayType.BusinessTrip, name: 'Business trip' },
    { id: WorkDayType.Conference, name: 'Conference' },
    { id: WorkDayType.MedicalCheckUp, name: 'Medical Check-up' },
    { id: WorkDayType.Office, name: 'Office' },
    { id: WorkDayType.Remote, name: 'Remote' },
    { id: WorkDayType.SickLeave, name: 'Sick leave' },
    { id: WorkDayType.Vacation, name: 'Vacation' },
];

export const CalendarDay = ({ day, flights, movies, offset, onWorkDayTypeChange, onShowMap }: Props) => {

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
        'medical-check-up': day.workDayType?.id === WorkDayType.MedicalCheckUp,
        'office': isWorkingDay && day.workDayType?.id !== WorkDayType.Remote,
        'remote': day.workDayType?.id === WorkDayType.Remote,
        'today': momentDay.isSame(moment(), 'day'),
        'vacation': day.workDayType?.id === WorkDayType.Vacation && !day.isHoliday,
        'weekend': isWeekend && !day.isHoliday,
    });

    const places = (day.locations ?? []).concat(day.events?.map(e => ({ name: e.name, id: e.id })) ?? [])
        .concat(flights.map(f => ({ name: `${f.origin?.iata} -> ${f.destination?.iata}`, id: f.destination?.iata })) ?? [])
        .concat(day.countries?.map(c => ({ name: c.name, id: c.id })) ?? []).reverse();

    const [isEdit, setIsEdit] = React.useState<boolean>(false);

    return (
        <Card
            className={classes}
            style={style}
        >
            <Card.Header>
                {momentDay.format('Do ddd')}
                {momentDay < moment() &&
                    <a className="pull-right" onClick={onShowMap}><FaRoute /></a>
                }
            </Card.Header>
            <Card.Body>
                <ListGroup>
                    <CalendarDaySubitems
                        cities={day.cities ?? []}
                        countries={day.countries ?? []}
                        events={day.events ?? []}
                        flights={flights}
                        movies={movies}
                        locations={day.locations ?? []}
                    />
                </ListGroup>
            </Card.Body>
            <Card.Footer>
                {isEdit && !day.isHoliday && !isWeekend &&
                    <Select
                        hideDefaultOption
                        options={workDayTypes}
                        defaultSelected={day.workDayType?.id ?? workDayTypes[0].id}
                        onBlur={() => setIsEdit(false)}
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