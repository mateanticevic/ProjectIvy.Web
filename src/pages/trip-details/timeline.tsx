import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { GiFinishLine } from 'react-icons/gi';
import { GrPlay } from 'react-icons/gr';
import moment from 'moment';
import { GoCalendar } from 'react-icons/go';
import { FaCar, FaPlaneDeparture } from 'react-icons/fa';

import { Flight } from 'types/flights';
import { Ride } from 'types/ride';

interface Props {
    from: moment.Moment;
    to: moment.Moment;
    flights: Flight[];
    rides: Ride[];
}

const simpleElement = (date, icon) => <VerticalTimelineElement
    date={moment(date).format('MMMM Do HH:mm')}
    icon={icon}
/>;

const dateElement = (date) => <VerticalTimelineElement
    date={moment(date).format('MMMM Do dddd')}
    icon={<GoCalendar />}
/>;

const flightElement = (flight: Flight) => <VerticalTimelineElement
    date={`${moment(flight.departure).format('HH:mm')} - ${moment(flight.arrival).format('HH:mm')}`}
    icon={<FaPlaneDeparture />}
/>;

const rideElement = (ride: Ride) => <VerticalTimelineElement
    date={`${moment(ride.departure).format('HH:mm')} - ${moment(ride.arrival).format('HH:mm')}`}
    icon={<FaCar />}
/>;

const rangeDates = (from: moment.Moment, to: moment.Moment) => {
    const dates: moment.Moment[] = [];


    for (let date = from.clone().add('day', 1); date < to; date = date.add('day', 1)) {
        dates.push(date.clone());
    }

    return dates;
};

const Timeline = ({ from, to, flights, rides }: Props) => {
    const fixed = [
        {
            date: from,
            element: () => simpleElement(from, <GrPlay />)
        },
        {
            date: to,
            element: () => simpleElement(to, <GiFinishLine />)
        }
    ];

    const dates = rangeDates(from, to).map(item => {
        return {
            date: item,
            element: () => dateElement(item),
        };
    });

    const flightElements = flights.map(flight => {
        return {
            date: moment(flight.departure),
            element: () => flightElement(flight),
        };
    });

    const rideElements = rides.map(ride => {
        return {
            date: moment(ride.departure),
            element: () => rideElement(ride),
        };
    });

    const all = fixed.concat(dates)
        .concat(flightElements)
        .concat(rideElements);

    return (
        <VerticalTimeline>
            {all.sort((a, b) => a.date.unix() - b.date.unix()).map(item => item.element())}
        </VerticalTimeline>
    );
};

export default Timeline;