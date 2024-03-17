import React from 'react';

import { Page } from 'pages/page';
import { Container } from 'react-bootstrap';
import { components } from 'types/ivy-types';
import api from 'api/main';
import { CalendarDay } from './calendar-day';
import moment from 'moment';

type CalendarSection = components['schemas']['CalendarSection'];

interface State {
    calendarSection?: CalendarSection;
}

class CalendarPage extends Page<unknown, State> {

    state: State = {
    }

    componentDidMount() {
        api.calendar.getSection('2024-2-1', '2024-3-1')
            .then(calendarSection => {
                this.setState({ calendarSection });
            });
    }

    render() {
        const { calendarSection } = this.state;
        return (
            <Container>
                <div className="calendar-container">
                    {calendarSection?.days?.reverse().map((day, i) =>
                        <CalendarDay
                            key={moment(day.date).format('YYYY-MM-dd')}
                            day={day}
                            offset={i === 0 ? moment(day.date).weekday() + 1 : 0}
                            onWorkDayTypeChange={workDayTypeId => this.onWorkDayTypeChange(moment(day.date).format('YYYY-MM-DD'), workDayTypeId)}
                        />
                    )}
                </div>
            </Container >
        );
    }

    onWorkDayTypeChange = (date: string, workDayTypeId: string) => {
        api.calendar.patch(date, workDayTypeId);
    }
}

export default CalendarPage;