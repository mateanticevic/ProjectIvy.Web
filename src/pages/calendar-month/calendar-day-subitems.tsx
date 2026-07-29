import React from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { MdMovieCreation, MdOutlineAirplanemodeActive, MdOutlineEvent } from 'react-icons/md';
import moment from 'moment';

import { VerticalNodes } from 'components/vertical-nodes';
import { components } from 'types/ivy-types';

type City = components['schemas']['City'];
type Country = components['schemas']['Country'];
type Event = components['schemas']['Event'];
type IcsCalendarEvent = components['schemas']['IcsCalendarEvent'];
type Flight = components['schemas']['Flight'];
type LocationVisited = components['schemas']['LocationVisited'];
type Movie = components['schemas']['Movie'];
type ToDo = components['schemas']['ToDo'];

interface Props {
    cities: City[];
    countries: Country[];
    events: Event[];
    externalEvents: IcsCalendarEvent[];
    flights: Flight[];
    locations: LocationVisited[];
    movies: Movie[];
    todos: ToDo[];
    onToggleCompleted?(todo: ToDo, isCompleted: boolean): void;
}

const formatClockTime = (time?: string) =>
    time ? moment(time).format('HH:mm') : '–';

const formatTimeSpent = (enterTime?: string, exitTime?: string) => {
    if (!enterTime || !exitTime) {
        return '–';
    }

    const minutes = Math.round(moment(exitTime).diff(moment(enterTime), 'minutes', true));

    if (minutes < 60) {
        return `${Math.max(minutes, 0)}m`;
    }

    return `${Math.round(minutes / 60)}h`;
};

const formatLocationNode = (location: LocationVisited, index: number, total: number) => {
    if (index === 0 && total > 1) {
        return formatClockTime(location.exitTime);
    }

    if (index === total - 1) {
        return formatClockTime(location.enterTime);
    }

    return formatTimeSpent(location.enterTime, location.exitTime);
};

const isAllDayEvent = (event: IcsCalendarEvent) =>
    moment(event.start).format('HH:mm') === '00:00' && (!event.end || moment(event.end).format('HH:mm') === '00:00');

const CalendarDaySubitems = ({ cities, countries, events, externalEvents, flights, locations, movies, todos, onToggleCompleted }: Props) => {

    const cityCountries = cities.map(c => c.country!.id!);

    return (
        <ListGroup>
            {cities.filter(c => c.id !== 'zagreb').map(c =>
                <ListGroup.Item key={c.id}>
                    <span className={`flag-icon flag-icon-${c.country!.id?.toLowerCase()}`} /> {c.name}
                </ListGroup.Item>
            )}
            {countries.filter(c => c.id !== 'HR' && !cityCountries.includes(c.id!)).map(c =>
                <ListGroup.Item key={c.id}>
                    <span className={`flag-icon flag-icon-${c!.id?.toLowerCase()}`} /> {c.name}
                </ListGroup.Item>
            )}
            {flights.map(f =>
                <ListGroup.Item key={f.id}>
                    <MdOutlineAirplanemodeActive /> {`${f.origin?.iata} -> ${f.destination?.iata}`}
                </ListGroup.Item>
            )}
            {events.map(e =>
                <ListGroup.Item key={e.id}>
                    <MdOutlineEvent /> {e.name}
                </ListGroup.Item>
            )}
            {externalEvents.map(e =>
                <ListGroup.Item key={e.uid}>
                    <div><MdOutlineEvent /> {e.summary}</div>
                    {e.start && !isAllDayEvent(e) && <div>{moment(e.start).format('HH:mm')}</div>}
                </ListGroup.Item>
            )}
            {locations.length > 0 &&
                <ListGroup.Item>
                    <VerticalNodes
                        items={locations.map((l, index) => ({
                            key: `${l.id ?? l.name}-${l.enterTime ?? index}`,
                            node: formatLocationNode(l, index, locations.length),
                            label: l.name,
                        }))}
                    />
                </ListGroup.Item>
            }
            {movies.map(m =>
                <ListGroup.Item key={m.imdbId}>
                    <MdMovieCreation /> <a target="_blank" href={`https://imdb.com/title/${m.imdbId}`}>{m.title}</a>
                </ListGroup.Item>
            )}
            {todos.map(t =>
                <ListGroup.Item key={t.id} className="d-flex align-items-center gap-2">
                    <Form.Check
                        type="checkbox"
                        checked={t.isCompleted}
                        disabled={!t.id}
                        onChange={e => onToggleCompleted?.(t, e.currentTarget.checked)}
                        aria-label={`Mark ${t.name ?? 'todo'} as completed`}
                    />
                    {t.name}
                </ListGroup.Item>
            )}
        </ListGroup>
    );
};

export default CalendarDaySubitems;