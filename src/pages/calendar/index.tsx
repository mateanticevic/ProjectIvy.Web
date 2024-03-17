import React from 'react';
import Datetime from 'react-datetime';

import { Page } from 'pages/page';
import { Container } from 'react-bootstrap';
import { components } from 'types/ivy-types';
import api from 'api/main';
import { CalendarDay } from './calendar-day';
import moment, { Moment } from 'moment';

type CalendarSection = components['schemas']['CalendarSection'];

interface State {
    calendarSection?: CalendarSection;
    startDay: Moment;
}

class CalendarPage extends Page<unknown, State> {

    state: State = {
        startDay: moment().startOf('month')
    }

    componentDidMount() {
        const { startDay } = this.state;
        this.onMonthChanged(startDay);
    }

    render() {
        const { calendarSection } = this.state;
        return (
            <Container>
                <Datetime
                    inputProps={{ readOnly: true }}
                    dateFormat="MMMM YYYY"
                    timeFormat={false}
                    onChange={month => this.onMonthChanged(month as Moment)}
                />
                <div className="calendar-container">
                    {calendarSection?.days?.reverse().map((day, i) =>
                        <CalendarDay
                            key={moment(day.date).format('YYYY-MM-DD')}
                            day={day}
                            offset={i === 0 ? moment(day.date).weekday() + 1 : 0}
                            onWorkDayTypeChange={workDayTypeId => this.onWorkDayTypeChange(moment(day.date).format('YYYY-MM-DD'), workDayTypeId)}
                        />
                    )}
                </div>
            </Container >
        );
    }

    onMonthChanged = (month: Moment) => {
        api.calendar.getSection(month.startOf('month').format('YYYY-MM-DD'), month.clone().endOf('month').format('YYYY-MM-DD'))
            .then(calendarSection => {
                this.setState({
                    calendarSection,
                    startDay: month.startOf('month')
                });
            });
    }

    onWorkDayTypeChange = (date: string, workDayTypeId: string) => {
        api.calendar.patch(date, workDayTypeId);
    }
}

export default CalendarPage;