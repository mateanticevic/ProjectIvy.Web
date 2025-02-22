import React from 'react';
import moment from 'moment';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { CalendarMonthDayItem } from './clalendar-month-day-item';
import { CalendarDate, CalendarDateBinary, CalendarDateFlag, CalendarDateIntensity, CalendarDateStyle } from './constants';

interface Props {
    dates: CalendarDateBinary[] | CalendarDateIntensity[] | CalendarDateStyle[] | CalendarDateFlag[];
    month: number;
    selectedDay: string | null;
    year: number;
    onDaySelect: (date: string) => void;
}

export const CalendarMonth = ({ dates, month, selectedDay, year, onDaySelect }: Props) => {

    return (
        <Card>
            <Card.Header>
                <Card.Title><Link to={`/calendar/${year}/${month}`}>{moment().month(month - 1).format('MMMM')}</Link></Card.Title>
            </Card.Header>
            <Card.Body>
                <div className="calendar-month-day-container">
                    {dates && dates.reverse().map(date =>
                        <CalendarMonthDayItem
                            date={date}
                            isSelected={(date as CalendarDate).date.format('YYYY-MM-DD') === (selectedDay ?? '')}
                            onClick={() => onDaySelect((date as CalendarDate).date.format('YYYY-MM-DD'))}
                        />
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};