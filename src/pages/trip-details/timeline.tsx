import React from 'react';
import { GiFinishLine } from 'react-icons/gi';
import { GrPlay } from 'react-icons/gr';
import moment from 'moment';
import { GoCalendar } from 'react-icons/go';
import { FaCar, FaPlaneDeparture } from 'react-icons/fa';

import { Ride } from 'types/ride';
import { components } from 'types/ivy-types';
import { Timeline as TimelineComponent, TimelineOrientation } from 'components/timeline';

type Flight = components['schemas']['Flight'];

interface Props {
    from: moment.Moment;
    to: moment.Moment;
    flights: Flight[];
    rides: Ride[];
}

type TimelineItemType = 'start' | 'end' | 'date' | 'flight' | 'ride';

interface TimelineItemData {
    type: TimelineItemType;
    flight?: Flight;
    ride?: Ride;
}

const rangeDates = (from: moment.Moment, to: moment.Moment) => {
    const dates: moment.Moment[] = [];

    for (let date = from.clone().add('day', 1); date < to; date = date.add('day', 1)) {
        dates.push(date.clone());
    }

    return dates;
};

const TripTimeline = ({ from, to, flights, rides }: Props) => {
    const timelineItems = [];

    // Start element
    timelineItems.push({
        value: from.toDate(),
        label: moment(from).format('MMMM Do HH:mm'),
        data: { type: 'start' as TimelineItemType }
    });

    // End element
    timelineItems.push({
        value: to.toDate(),
        label: moment(to).format('MMMM Do HH:mm'),
        data: { type: 'end' as TimelineItemType }
    });

    // Date elements
    rangeDates(from, to).forEach(date => {
        timelineItems.push({
            value: date.toDate(),
            label: moment(date).format('MMMM Do dddd'),
            data: { type: 'date' as TimelineItemType }
        });
    });

    // Flight elements
    flights.forEach(flight => {
        timelineItems.push({
            value: moment(flight.departure).toDate(),
            label: `${moment(flight.departure).format('HH:mm')} - ${moment(flight.arrival).format('HH:mm')}`,
            data: { type: 'flight' as TimelineItemType, flight }
        });
    });

    // Ride elements
    rides.forEach(ride => {
        timelineItems.push({
            value: moment(ride.departure).toDate(),
            label: `${moment(ride.departure).format('HH:mm')} - ${moment(ride.arrival).format('HH:mm')}`,
            data: { type: 'ride' as TimelineItemType, ride }
        });
    });

    const renderItem = (item: { value: Date | number; label?: string; data?: TimelineItemData }, index: number) => {
        if (!item.data) return null;

        switch (item.data.type) {
            case 'start':
                return <div className="timeline-icon"><GrPlay /></div>;
            case 'end':
                return <div className="timeline-icon"><GiFinishLine /></div>;
            case 'date':
                return <div className="timeline-icon"><GoCalendar /></div>;
            case 'flight':
                return <div className="timeline-icon"><FaPlaneDeparture /></div>;
            case 'ride':
                return <div className="timeline-icon"><FaCar /></div>;
            default:
                return null;
        }
    };

    return (
        <TimelineComponent
            items={timelineItems}
            orientation="horizontal"
            valueType="date"
            renderItem={renderItem}
        />
    );
};

export default TripTimeline;