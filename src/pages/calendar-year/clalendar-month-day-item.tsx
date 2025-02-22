import classNames from 'classnames';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import {
    CalendarDateBinary,
    CalendarDateFlag,
    CalendarDateIntensity,
    CalendarDateStyle,
    isCalendarDateBinary,
    isCalendarDateFlag,
    isCalendarDateStyle,
    isCalendarDateValue
} from './constants';

interface Props {
    date: CalendarDateBinary | CalendarDateIntensity | CalendarDateStyle | CalendarDateFlag;
    isSelected: boolean;
    onClick: () => void;
}

export const CalendarMonthDayItem = ({ date, isSelected, onClick }: Props) => {
    const style = {
        '--offset': (date.date.date() === 1 ? date.date.weekday() + 1 : 0)
    };

    const classes = classNames('calendar-month-day-item', {
        'country': isCalendarDateFlag(date) && date.countryId,
        'active': (isCalendarDateValue(date) && date.value > 0) || (isCalendarDateBinary(date) && date.active),
        [date.style]: isCalendarDateStyle(date)
    });

    return (
        <div
            key={date.date.format('YYYY-MM-DD')}
            className={classes}
            style={style}
            onClick={onClick}
        >
            {isCalendarDateFlag(date) && date.countryId && (
                <span
                    className={`flag-icon flag-icon-${date.countryId.toLowerCase()}`}
                    title={date.countryId}
                />
            )}
            <Dropdown.Menu show={isSelected}>
                <Dropdown.Header>{date.date.format('dddd Do')}</Dropdown.Header>
                <Dropdown.Item eventKey="2">Details</Dropdown.Item>
                <Dropdown.Item eventKey="3">Movement</Dropdown.Item>
            </Dropdown.Menu>
        </div>
    );
};