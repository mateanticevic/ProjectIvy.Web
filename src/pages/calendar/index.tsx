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
import _ from 'lodash';

type CalendarSection = components['schemas']['CalendarSection'];
type Flight = components['schemas']['Flight'];
type Location = components['schemas']['Location'];
type Movie = components['schemas']['Movie'];
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
    flights: Flight[];
    isMapModalOpen: boolean;
    locationsByDay: KeyValuePair<Location[]>[];
    movies: Movie[];
    startDay: Moment;
    trackings: Tracking[];
}

class CalendarPage extends Page<Props, State> {

    state: State = {
        flights: [],
        locationsByDay: [],
        isMapModalOpen: false,
        movies: [],
        startDay: this.props.params.year && this.props.params.month ? moment(`${this.props.params.year}-${this.props.params.month}-01`) : moment().startOf('month'),
        trackings: [],
    }

    componentDidMount() {
        const { startDay } = this.state;
        this.onMonthChanged(startDay);
    }

    render() {
        const { calendarSection, flights, locationsByDay, movies } = this.state;
        return (
            <Container>
                <Datetime
                    inputProps={{ readOnly: true }}
                    dateFormat="MMMM YYYY"
                    timeFormat={false}
                    value={this.state.startDay}
                    onChange={month => this.onMonthChanged(month as Moment)}
                />
                {calendarSection?.days?.filter(d => d.workDayType?.id === 'remote').length}
                <div className="calendar-container">
                    {calendarSection?.days?.slice().reverse().map((day, i) =>
                        <CalendarDay
                            key={moment(day.date).format('YYYY-MM-DD')}
                            day={day}
                            flights={flights.filter(f => moment(f.departureLocal).format('YYYY-MM-DD') === moment(day.date).format('YYYY-MM-DD')) ?? []}
                            movies={movies.filter(m => moment(m.timestamp).format('YYYY-MM-DD') === moment(day.date).format('YYYY-MM-DD')) ?? []}
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
        const from = month.startOf('month').format('YYYY-MM-DD');
        const to = month.clone().endOf('month').format('YYYY-MM-DD');

        api.calendar.getDays(from, to)
            .then(calendarSection => {
                this.setState({
                    calendarSection,
                    startDay: month.startOf('month')
                });
            });
        api.movie.get({ from, to, pageAll: true })
            .then(response => this.setState({ movies: response.items }));
        // api.location.getByDay(from, to)
        //     .then(locationsByDay => {
        //         this.setState({
        //             locationsByDay,
        //         });
        //     });
        api.flight.get({ from, to: month.clone().endOf('month').add(1, 'day').format('YYYY-MM-DD') })
            .then(data => {
                this.setState({
                    flights: data.items,
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