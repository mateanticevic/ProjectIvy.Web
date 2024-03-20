import React from 'react';
import Datetime from 'react-datetime';

import { Page } from 'pages/page';
import { Container } from 'react-bootstrap';
import { components } from 'types/ivy-types';
import api from 'api/main';
import { CalendarDay } from './calendar-day';
import moment, { Moment } from 'moment';
import { useParams } from 'react-router-dom';
import { SelectOption } from 'types/common';

type CalendarSection = components['schemas']['CalendarSection'];

interface PagePath {
    year: string;
    month: string;
}

interface Props {
    params: PagePath;
}

interface State {
    calendarSection?: CalendarSection;
    startDay: Moment;
}

class CalendarPage extends Page<Props, State> {

    state: State = {
        startDay: this.props.params.year && this.props.params.month ? moment(`${this.props.params.year}-${this.props.params.month}-01`) : moment().startOf('month')
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
                    value={this.state.startDay}
                    onChange={month => this.onMonthChanged(month as Moment)}
                />
                <div className="calendar-container">
                    {calendarSection?.days?.reverse().map((day, i) =>
                        <CalendarDay
                            key={moment(day.date).format('YYYY-MM-DD')}
                            day={day}
                            offset={i === 0 ? moment(day.date).weekday() + 1 : 0}
                            onWorkDayTypeChange={workDayType => this.onWorkDayTypeChange(moment(day.date).format('YYYY-MM-DD'), workDayType)}
                        />
                    )}
                </div>
            </Container >
        );
    }

    onMonthChanged = (month: Moment) => {
        api.calendar.getDays(month.startOf('month').format('YYYY-MM-DD'), month.clone().endOf('month').format('YYYY-MM-DD'))
            .then(calendarSection => {
                this.setState({
                    calendarSection,
                    startDay: month.startOf('month')
                });
            });
    }

    onWorkDayTypeChange = (date: string, workDayType: SelectOption) => {
        const { calendarSection } = this.state;
        if (calendarSection) {
            const updatedDays = calendarSection.days.map(day => {
                console.log(moment(day.date).format('YYYY-MM-DD'));
                if (moment(day.date).format('YYYY-MM-DD') === date) {
                    return {
                        ...day,
                        workDayType: {
                            id: workDayType.id,
                            name: workDayType.name
                        }
                    };
                }
                return day;
            }).reverse();
            this.setState({
                calendarSection: {
                    ...calendarSection,
                    days: updatedDays
                }
            });
        }
        api.calendar.patch(date, workDayType.id);
    }
}

export default () => <CalendarPage params={useParams() as PagePath} />;