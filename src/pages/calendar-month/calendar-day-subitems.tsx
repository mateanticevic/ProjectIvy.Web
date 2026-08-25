import React from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import { MdMovieCreation, MdOutlineAirplanemodeActive, MdOutlineEvent } from 'react-icons/md';
import moment from 'moment';
import mtz from 'moment-timezone';

import { VerticalNodeItem, VerticalNodes } from 'components/vertical-nodes';
import { components } from 'types/ivy-types';

type City = components['schemas']['City'];
type Country = components['schemas']['Country'];
type Event = components['schemas']['Event'];
type IcsCalendarEvent = components['schemas']['IcsCalendarEvent'];
type Flight = components['schemas']['Flight'];
type Movie = components['schemas']['Movie'];
type TimelineItem = components['schemas']['TimelineItem'];
type ToDo = components['schemas']['ToDo'];

const DISPLAY_TIMEZONE = 'Europe/Zagreb';

interface Props {
    cities: City[];
    countries: Country[];
    events: Event[];
    externalEvents: IcsCalendarEvent[];
    flights: Flight[];
    movies: Movie[];
    todos: ToDo[];
    timeline: TimelineItem[];
    onToggleCompleted?(todo: ToDo, isCompleted: boolean): void;
}

const formatClockTime = (time?: string | null) =>
    time ? mtz.utc(time).tz(DISPLAY_TIMEZONE).format('HH:mm') : '–';

const formatTimeSpent = (enterTime?: string | null, exitTime?: string | null) => {
    if (!enterTime || !exitTime) {
        return '–';
    }

    const minutes = Math.round(moment(exitTime).diff(moment(enterTime), 'minutes', true));

    if (minutes < 60) {
        return `${Math.max(minutes, 0)}m`;
    }

    return `${Math.round(minutes / 60)}h`;
};

const formatStayNode = (item: TimelineItem, index: number, total: number) => {
    if (index === 0 && total > 1) {
        return formatClockTime(item.exitTime);
    }

    if (index === total - 1) {
        return formatClockTime(item.enterTime);
    }

    return formatTimeSpent(item.enterTime, item.exitTime);
};

const coalesceCityStays = (timeline: TimelineItem[]): TimelineItem[] => {
    const skip = new Set<number>();
    const result: TimelineItem[] = [];

    for (let i = 0; i < timeline.length; i++) {
        if (skip.has(i)) {
            continue;
        }

        const item = timeline[i];
        if (item.city && item.enterTime && !item.exitTime) {
            const exitIndex = timeline.findIndex((other, j) =>
                j > i
                && !skip.has(j)
                && other.city?.id === item.city?.id
                && other.exitTime
                && !other.enterTime
            );

            if (exitIndex !== -1) {
                skip.add(exitIndex);
                result.push({ ...item, exitTime: timeline[exitIndex].exitTime });
                continue;
            }
        }

        result.push(item);
    }

    return result;
};

const toTimelineNodes = (timeline: TimelineItem[]): VerticalNodeItem[] => {
    const items = coalesceCityStays(timeline);
    const nodes: VerticalNodeItem[] = [];
    const locationCount = items.filter(item => item.location).length;
    const cityCount = items.filter(item => item.city).length;
    let locationIndex = 0;
    let cityIndex = 0;

    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const next = items[index + 1];

        if (item.location) {
            nodes.push({
                key: `${item.location.id ?? item.location.name}-${item.enterTime ?? index}`,
                node: formatStayNode(item, locationIndex, locationCount),
                label: item.location.name,
            });
            locationIndex += 1;
            continue;
        }

        if (!item.city) {
            continue;
        }

        nodes.push({
            key: `${item.city.id}-${item.enterTime ?? item.exitTime ?? index}`,
            node: formatStayNode(item, cityIndex, cityCount),
            label: item.city.name,
        });
        cityIndex += 1;

        if (item.exitTime && next?.city && next.enterTime && next.city.id !== item.city.id) {
            nodes.push({
                key: `${item.city.id}-to-${next.city.id}-${item.exitTime}`,
                node: formatTimeSpent(item.exitTime, next.enterTime),
                label: (
                    <span className="d-inline-flex align-items-center gap-1">
                        {item.city.name}
                        <span aria-hidden>→</span>
                        {next.city.name}
                    </span>
                ),
            });
        }
    }

    return nodes;
};

const isAllDayEvent = (event: IcsCalendarEvent) =>
    moment(event.start).format('HH:mm') === '00:00' && (!event.end || moment(event.end).format('HH:mm') === '00:00');

const CalendarDaySubitems = ({ cities, countries, events, externalEvents, flights, movies, todos, timeline, onToggleCompleted }: Props) => {

    const cityCountries = cities.map(c => c.country!.id!);
    const timelineNodes = toTimelineNodes(timeline);

    return (
        <ListGroup>
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
            {timelineNodes.length > 0 &&
                <ListGroup.Item>
                    <VerticalNodes items={timelineNodes} />
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