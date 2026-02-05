import React, { useState, useEffect } from 'react';
import Datetime from 'react-datetime';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import moment, { Moment } from 'moment';
import 'moment-timezone';
import { components } from 'types/ivy-types';
import api from 'api/main';
import { CalendarDay } from './calendar-day';
import MapModal from './map-modal';
import { KeyValuePair } from 'types/grouping';
import { SelectOption } from 'types/common';

type CalendarSection = components['schemas']['CalendarSection'];
type Flight = components['schemas']['Flight'];
type Location = components['schemas']['Location'];
type Movie = components['schemas']['Movie'];
type Tracking = components['schemas']['Tracking'];

interface PagePath {
    year: string;
    month: string;
}

const CalendarMonthPage: React.FC = () => {
    const params = useParams<PagePath>();
    const [calendarSection, setCalendarSection] = useState<CalendarSection | undefined>(undefined);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [locationsByDay, setLocationsByDay] = useState<KeyValuePair<Location[]>[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [startDay, setStartDay] = useState<Moment>(
        params.year && params.month ? moment(`${params.year}-${params.month}-01`) : moment().startOf('month')
    );
    const [trackings, setTrackings] = useState<Tracking[]>([]);

    useEffect(() => {
        onMonthChanged(startDay);
    }, [startDay]);

    const onShowMap = (date: string, timezone?: string) => {
        setIsMapModalOpen(true);
        let from: string;
        let to: string;
        
        if (timezone) {
            // Use the provided timezone to adjust the start and end times
            const startOfDay = moment.tz(date, timezone).startOf('day');
            const endOfDay = moment.tz(date, timezone).endOf('day');
            from = startOfDay.utc().format('YYYY-MM-DDTHH:mm:ss');
            to = endOfDay.utc().format('YYYY-MM-DDTHH:mm:ss');
        } else {
            // Fallback to the original behavior
            from = moment(date).format('YYYY-MM-DD');
            to = moment(date).add(1, 'd').format('YYYY-MM-DD');
        }
        
        api.tracking.get({ from, to }).then(trackings => {
            setTrackings(trackings);
        });
    };

    const onMonthChanged = (month: Moment) => {
        window.history.replaceState(null, '', `/calendar/${month.year()}/${month.month() + 1}`);
        const from = month.startOf('month').format('YYYY-MM-DD');
        const to = month.clone().endOf('month').format('YYYY-MM-DD');

        api.calendar.getDays(from, to)
            .then(calendarSection => {
                setCalendarSection(calendarSection);
                setStartDay(month.startOf('month'));
            });
        api.movie.get({ from, to, pageAll: true })
            .then(response => setMovies(response.items));
        // api.location.getByDay(from, to)
        //     .then(locationsByDay => {
        //         setLocationsByDay(locationsByDay);
        //     });
        api.flight.get({ from, to: month.clone().endOf('month').add(1, 'day').format('YYYY-MM-DD') })
            .then(data => setFlights(data.items));
    };

    const onWorkDayTypeChange = (date: string, workDayType: SelectOption) => {
        if (calendarSection) {
            const updatedDays = calendarSection.days.map(day => {
                if (moment(day.date).format('YYYY-MM-DD') === date) {
                    return {
                        ...day,
                        workDayType: {
                            id: workDayType.id,
                            name: workDayType.name
                        }
                    };
                }
                return day;
            });
            setCalendarSection({
                ...calendarSection,
                days: updatedDays
            });
        }
        api.calendar.patch(date, workDayType.id);
    };

    return (
        <Container>
            <Datetime
                inputProps={{ readOnly: true }}
                dateFormat="MMMM YYYY"
                timeFormat={false}
                value={startDay}
                onChange={month => onMonthChanged(month as Moment)}
            />
            {calendarSection?.days?.filter(d => d.workDayType?.id === 'remote').length}
            <div className="calendar-container">
                {calendarSection?.days?.slice().reverse().map((day, i) =>
                    <CalendarDay
                        key={moment(day.date).format('YYYY-MM-DD')}
                        day={day}
                        flights={flights.filter(f => moment(f.departureLocal).format('YYYY-MM-DD') === moment(day.date).format('YYYY-MM-DD')) ?? []}
                        movies={movies.filter(m => moment(m.timestamp).format('YYYY-MM-DD') === moment(day.date).format('YYYY-MM-DD')) ?? []}
                        offset={i === 0 ? moment(day.date).weekday() + 1 : 0}
                        onShowMap={(timezone) => onShowMap(moment(day.date).format('YYYY-MM-DD'), timezone)}
                        onWorkDayTypeChange={workDayType => onWorkDayTypeChange(moment(day.date).format('YYYY-MM-DD'), workDayType)}
                    />
                )}
            </div>
            <MapModal
                isOpen={isMapModalOpen}
                trackings={trackings}
                onClose={() => setIsMapModalOpen(false)}
            />
        </Container>
    );
};

export default CalendarMonthPage;