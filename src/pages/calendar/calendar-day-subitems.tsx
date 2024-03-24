import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { IoMdHome } from 'react-icons/io';
import { MdOutlineAirplanemodeActive, MdOutlineEvent } from 'react-icons/md';

import { components } from 'types/ivy-types';

type City = components['schemas']['City'];
type Country = components['schemas']['Country'];
type Event = components['schemas']['Event'];
type Flight = components['schemas']['Flight'];
type Location = components['schemas']['Location'];

interface Props {
    cities: City[];
    countries: Country[];
    events: Event[];
    flights: Flight[];
    locations: Location[];
}

const CalendarDaySubitems = ({ cities, countries, events, flights, locations }: Props) => {

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
                    <IoMdHome /> {l.name}
                </ListGroup.Item>
            )}
        </ListGroup>
    );
};

export default CalendarDaySubitems;