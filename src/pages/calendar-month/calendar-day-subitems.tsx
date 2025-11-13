import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { MdMovieCreation, MdOutlineAirplanemodeActive, MdOutlineEvent } from 'react-icons/md';

import LocationTypeIcon from 'components/location-type-icon';
import { components } from 'types/ivy-types';

type City = components['schemas']['City'];
type Country = components['schemas']['Country'];
type Event = components['schemas']['Event'];
type Flight = components['schemas']['Flight'];
type Location = components['schemas']['Location'];
type Movie = components['schemas']['Movie'];

interface Props {
    cities: City[];
    countries: Country[];
    events: Event[];
    flights: Flight[];
    locations: Location[];
    movies: Movie[];
}

const CalendarDaySubitems = ({ cities, countries, events, flights, locations, movies }: Props) => {

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
            {locations.map(l =>
                <ListGroup.Item key={l.id}>
                    <LocationTypeIcon typeId={l.type?.id} /> {l.name}
                </ListGroup.Item>
            )}
            {movies.map(m =>
                <ListGroup.Item key={m.imdbId}>
                    <MdMovieCreation /> <a target="_blank" href={`https://imdb.com/title/${m.imdbId}`}>{m.title}</a>
                </ListGroup.Item>
            )}
        </ListGroup>
    );
};

export default CalendarDaySubitems;