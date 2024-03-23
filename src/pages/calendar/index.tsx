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
import MapModal from './map-modal';
import { KeyValuePair } from 'types/grouping';

type CalendarSection = components['schemas']['CalendarSection'];
type Location = components['schemas']['Location'];
type Tracking = components['schemas']['Tracking'];

interface PagePath {
    year: string;
    month: string;
}

interface Props {
    params: PagePath;
}

interface State {
    calendarSection?: CalendarSection;
    isMapModalOpen: boolean;
    locationsByDay: KeyValuePair<Location[]>[];
    startDay: Moment;
    trackings: Tracking[];
}

class CalendarPage extends Page<Props, State> {

    state: State = {
        locationsByDay: [],
        isMapModalOpen: false,
        startDay: this.props.params.year && this.props.params.month ? moment(`${this.props.params.year}-${this.props.params.month}-01`) : moment().startOf('month'),
        trackings: [],
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
                    {calendarSection?.days?.slice().reverse().map((day, i) =>
                        <CalendarDay
                            key={moment(day.date).format('YYYY-MM-DD')}
                            day={day}
                            locations={this.state.locationsByDay.filter(l => moment(l.key).format('YYYY-MM-DD') === moment(day.date).format('YYYY-MM-DD'))[0]?.value || []}
                            offset={i === 0 ? moment(day.date).weekday() + 1 : 0}
                            onShowMap={() => this.onShowMap(moment(day.date).format('YYYY-MM-DD'))}
                            onWorkDayTypeChange={workDayType => this.onWorkDayTypeChange(moment(day.date).format('YYYY-MM-DD'), workDayType)}
                        />
                    )}
                </div>
                <MapModal
                    isOpen={this.state.isMapModalOpen}
                    trackings={this.state.trackings}
                    onClose={() => this.setState({ isMapModalOpen: false })}
                />
            </Container>
        );
    }

    onShowMap = (date: string) => {
        this.setState({
            isMapModalOpen: true,
        });
        api.tracking.get({ from: moment(date).format('YYYY-MM-DD'), to: moment(date).add(1, 'd').format('YYYY-MM-DD') }).then(trackings => {
            this.setState({
                trackings,
            });
        });
    }

    onMonthChanged = (month: Moment) => {
        api.calendar.getDays(month.startOf('month').format('YYYY-MM-DD'), month.clone().endOf('month').format('YYYY-MM-DD'))
            .then(calendarSection => {
                this.setState({
                    calendarSection,
                    startDay: month.startOf('month')
                });
            });
        api.location.getByDay(month.startOf('month').format('YYYY-MM-DD'), month.clone().endOf('month').format('YYYY-MM-DD'))
            .then(locationsByDay => {
                this.setState({
                    locationsByDay,
                });
            });
    }

    onWorkDayTypeChange = (date: string, workDayType: SelectOption) => {
        const { calendarSection } = this.state;
        if (calendarSection) {
            const updatedDays = calendarSection.days.map(day => {
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
            });
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