import classNames from 'classnames';
import React from 'react';
import moment from 'moment';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
    CalendarDateBinary,
    CalendarDateFlag,
    CalendarDateIntensity,
    CalendarDateStyle,
    CalendarDateText,
    isCalendarDateBinary,
    isCalendarDateFlag,
    isCalendarDateIntensity,
    isCalendarDateStyle,
    isCalendarDateText,
    isCalendarDateValue
} from './constants';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { GiPayMoney } from 'react-icons/gi';

interface Props {
    date: CalendarDateBinary | CalendarDateIntensity | CalendarDateStyle | CalendarDateFlag | CalendarDateText;
    isLoading: boolean;
    isSelected: boolean;
    showDate?: boolean;
    onClick: () => void;
    showTrackings: () => void;
}

export const CalendarMonthDayItem = ({ date, isLoading, isSelected, showDate, onClick, showTrackings }: Props) => {
    const navigate = useNavigate();
    
    const style = {
        '--offset': (date.date.date() === 1 ? date.date.weekday() + 1 : 0),
        // Pass intensity as a CSS variable if present
        ...(isCalendarDateIntensity(date) && date.intensity > 0
            ? { '--intensity': date.intensity }
            : {})
    };

    const classes = classNames('calendar-month-day-item', {
        'active': (isCalendarDateValue(date) && date.value > 0) || (isCalendarDateBinary(date) && date.active),
        'country': isCalendarDateFlag(date) && date.countryId,
        'loading': isLoading,
        'today': moment().isSame(date.date, 'day'),
        [date.style]: !isLoading && isCalendarDateStyle(date),
        'intensity-blue': isCalendarDateIntensity(date) && date.intensity === 1
    });

    const day = date.date.date();

    return (
        <div
            key={date.date.format('YYYY-MM-DD')}
            className={classes}
            style={style}
            onClick={onClick}
        >
            <Dropdown.Menu show={isSelected}>
                <Dropdown.Header>
                    {date.date.format('dddd Do')}
                    {isCalendarDateText(date) && date.description && (
                        <div>{date.description}</div>
                    )}
                </Dropdown.Header>
                <Dropdown.Item eventKey="2">Details</Dropdown.Item>
                <Dropdown.Item eventKey="4" onClick={(e) => {
                    e.stopPropagation();
                    const formattedDate = date.date.format('YYYY-MM-DD');
                    navigate(`/expenses?from=${formattedDate}&to=${formattedDate}`);
                }}><GiPayMoney /> Expenses</Dropdown.Item>
                {date.date.isBefore(moment()) &&
                    <Dropdown.Item eventKey="3" onClick={showTrackings}><FaMagnifyingGlass /> Tracking preview</Dropdown.Item>
                }
            </Dropdown.Menu>
            {!isLoading && isCalendarDateFlag(date) && date.countryId && (
                <span
                    className={`flag-icon flag-icon-${date.countryId.toLowerCase()}`}
                    title={date.countryId}
                    style={{ pointerEvents: 'none' }}
                />
            )}
            {!isLoading && isCalendarDateText(date) && date.label && (
                <span className="text-label">{date.label}</span>
            )}
            {showDate &&
                <span className="day-number">{day}</span>
            }
        </div>
    );
};