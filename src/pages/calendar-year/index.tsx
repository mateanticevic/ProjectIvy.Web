import React, { useEffect, useState } from "react";
import { Card, Container, Form, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import moment from "moment";

import { CalendarMonth } from "./calendar-month";
import api from "api/main";
import AsyncSelect from "react-select/async";
import { cityLoader, locationLoader } from "utils/select-loaders";
import { useReactSelectStyles } from "utils/react-select-dark-theme";
import { CalendarDateBinary, CalendarDateFlag, CalendarDateIntensity, CalendarDateStyle, CalendarDateText, CalendarDateValue, CalendarMode } from "./constants";
import { workDayTypeToStyle } from "./mappers";
import { WorkDayLegend } from "./work-day-legend";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import TrackingModal from "widgets/tracking-modal";

export const CalendarYearPage = () => {

    const { year: yearFromParam } = useParams<{ year: string }>();
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const reactSelectStyles = useReactSelectStyles();

    const [calendarMode, setCalendarMode] = useState<CalendarMode>(CalendarMode.WorkDays);
    const [calendarDates, setCalendarDates] = useState([] as (CalendarDateBinary[] | CalendarDateIntensity[] | CalendarDateStyle[] | CalendarDateFlag[] | CalendarDateText[]));
    const [cityId, setCityId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [locationId, setLocationId] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [showDate, setShowDate] = useState<boolean>(false);
    const [trackingDate, setTrackingDate] = useState<string | null>(null);
    const [year, setYear] = useState(parseInt(yearFromParam ?? moment().year().toString()));
    window.history.replaceState(null, '', `/calendar/${year}`);

    const getWorkDayTypeCount = (typeId: string) =>
        calendarDates.filter(x => (x as CalendarDateStyle).style === typeId).length;

    const load = () => {
        if (calendarMode === CalendarMode.Countries) {
            loadCountries();
        }
        else if (calendarMode === CalendarMode.WorkDays) {
            loadWorkDays();
        }
        else if (calendarMode === CalendarMode.Beer) {
            loadBeer();
        }
        else if (calendarMode === CalendarMode.Birthdays) {
            loadBirthdays();
        }
        else if (calendarMode === CalendarMode.Expenses) {
            loadExpenses();
        }
        else if (calendarMode === CalendarMode.Trips) {
            loadTrips();
        }
        else if (calendarMode === CalendarMode.Cities) {
            onCitySelected();
        }
        else if (calendarMode === CalendarMode.Locations) {
            onLocationSelected();
        }
    };

    const onCitySelected = () => {
        if (!cityId) {
            return;
        }
        setIsLoading(true);
        api.city.getDays(cityId, { from: `${year}-01-01`, to: `${year}-12-31` })
            .then(dates => {
                const results = [] as CalendarDateBinary[];
                for (let date = moment(`${year}-01-01`); !date.isSame(moment(`${year}-12-31`), 'day'); date = date.add(1, 'day')) {
                    results.push({
                        date: date.clone(),
                        active: dates.some(x => moment(x).isSame(date, 'day'))
                    });
                }
                setCalendarDates(results.reverse());
                setIsLoading(false);
            });
    };

    const onLocationSelected = () => {
        if (!locationId) {
            return;
        }
        setIsLoading(true);
        api.location.getDays(locationId)
            .then(dates => {
                const momentDates = dates.map(x => moment(x));
                const results = [] as CalendarDateBinary[];
                for (let date = moment(`${year}-01-01`); !date.isSame(moment(`${year}-12-31`), 'day'); date = date.add(1, 'day')) {
                    results.push({
                        date: date.clone(),
                        active: momentDates.some(x => x.isSame(date.clone(), 'day'))
                    });
                }
                setCalendarDates(results.reverse());
                setIsLoading(false);
            });
    };

    const loadBeer = () => {
        setIsLoading(true);
        api.consumation.getSumByDay({ from: `${year}-01-01`, to: `${year}-12-31` })
            .then(volumeByDay => {
                const results = [] as CalendarDateValue[];
                for (let date = moment(`${year}-01-01`); !date.isSame(moment(`${year}-12-31`), 'day'); date = date.add(1, 'day')) {
                    results.push({
                        date: date.clone(),
                        value: volumeByDay.find(x => x.key === date.format('YYYY-MM-DD 00:00:00.000'))?.value ?? 0
                    });
                }
                setCalendarDates(results.reverse());
                setIsLoading(false);
            });
    };

    const loadBirthdays = () => {
        setIsLoading(true);
        api.person.getByDateOfBirth()
            .then(birthdaysByDay => {
                const results = [] as CalendarDateText[];
                for (let date = moment(`${year}-01-01`); !date.isSame(moment(`${year}-12-31`), 'day'); date = date.add(1, 'day')) {
                    const birthdayMatches = birthdaysByDay.filter(x =>
                        moment(x.dateOfBirth).format('MM-DD') === date.format('MM-DD') &&
                        x.people && x.people.length > 0
                    );
                    const people = birthdayMatches.flatMap(x => x.people || []);

                    let label = '';
                    let description = '';

                    if (people.length === 1) {
                        const person = people[0];
                        const firstInitial = person.firstName?.charAt(0)?.toUpperCase() || '';
                        const lastInitial = person.lastName?.charAt(0)?.toUpperCase() || '';
                        label = firstInitial + lastInitial;
                    } else if (people.length > 1) {
                        label = people.length.toString();
                    }

                    description = people
                        .map(p => `${p.firstName || ''} ${p.lastName || ''}`.trim())
                        .filter(name => name.length > 0)
                        .join(', ');

                    results.push({
                        date: date.clone(),
                        label,
                        description
                    });
                }
                setCalendarDates(results.reverse());
                setIsLoading(false);
            });
    };

    const loadCountries = () => {
        setIsLoading(true);
        api.country.getVisitedByDay({ from: `${year}-01-01`, to: `${year}-12-31` })
            .then(countriesByDay => {
                const results = [] as CalendarDateFlag[];
                for (let date = moment(`${year}-01-01`); !date.isSame(moment(`${year}-12-31`), 'day'); date = date.add(1, 'day')) {
                    results.push({
                        date: date.clone(),
                        countryId: countriesByDay.find(x => x.key === date.format('YYYY-MM-DD 00:00:00.000'))?.value?.filter(x => x !== 'HR')[0]
                    });
                }
                setCalendarDates(results.reverse());
                setIsLoading(false);
            });
    };

    const loadWorkDays = () => {
        api.workDay.get({ from: `${year}-01-01`, to: `${year}-12-31` })
            .then(workDays => {
                setCalendarDates(workDays.map(x => ({
                    date: moment(x.date),
                    style: workDayTypeToStyle(moment(x.date), x.type!)
                })) as CalendarDateStyle[]);
                setIsLoading(false);
            });
    };

    const loadExpenses = () => {
        setIsLoading(true);
        api.expense.getSumByDay({ from: `${year}-01-01`, to: `${year}-12-31`, excludeTypeId: 'utilities' })
            .then(expenseByDay => {
                const results = [] as CalendarDateText[];
                for (let date = moment(`${year}-01-01`); !date.isSame(moment(`${year}-12-31`), 'day'); date = date.add(1, 'day')) {
                    const value = expenseByDay.find(x => x.key === date.format('YYYY-MM-DD 00:00:00.000'))?.value ?? 0;
                    let label = '';
                    if (value > 0) {
                        if (value < 1000) {
                            label = Math.ceil(value).toString();
                        } else if (value < 10000) {
                            label = (Math.round(value / 100) / 10).toString() + 'k';
                        } else {
                            label = Math.round(value / 1000).toString() + 'k';
                        }
                    }
                    results.push({
                        date: date.clone(),
                        label,
                        description: value > 0 ? value.toString() : ''
                    });
                }
                setCalendarDates(results.reverse());
                setIsLoading(false);
            });
    };

    const loadTrips = () => {
        setIsLoading(true);
        api.trips.get({ From: `${year}-01-01`, To: `${year}-12-31`, Page: 1, PageSize: 1000 })
            .then(trips => {
                const results = [] as CalendarDateBinary[];
                const tripItems = trips.items ?? [];
                for (let date = moment(`${year}-01-01`); !date.isSame(moment(`${year}-12-31`), 'day'); date = date.add(1, 'day')) {
                    results.push({
                        date: date.clone(),
                        active: tripItems.some(trip => {
                            const from = moment(trip.timestampStart);
                            const to = moment(trip.timestampEnd ?? trip.timestampStart);
                            return date.isBetween(from, to, 'day', '[]');
                        })
                    });
                }
                setCalendarDates(results.reverse());
                setIsLoading(false);
            });
    };

    const onShowTrackings = (date: string) => {
        setTrackingDate(date);
        setIsMapModalOpen(true);
    }

    useEffect(() => {
        load();
    }, [year]);

    useEffect(() => {
        load();
    }, [calendarMode]);

    useEffect(() => {
        load();
    }, [cityId, locationId]);

    useEffect(() => {
        loadWorkDays();
        document.body.addEventListener('click', e => {
            if (e.target instanceof HTMLElement && e.target.className.includes('calendar-month-day-item')) {
                return;
            }
            setSelectedDay(null);
        });
    }, []);

    return (
        <Container>
            <Card>
                <Card.Body>
                    <h1>
                        <IoMdArrowDropleft onClick={() => setYear(year - 1)} />
                        {year}
                        {year !== moment().year() &&
                            <IoMdArrowDropright onClick={() => setYear(year + 1)} />
                        }
                    </h1>
                    <ToggleButtonGroup
                        className="calendar-mode-toggle"
                        name="options"
                        type="radio"
                        value={calendarMode}
                        onChange={mode => setCalendarMode(mode as CalendarMode)}
                    >
                        <ToggleButton value={CalendarMode.Beer} id={CalendarMode.Beer.toString()}>Beer</ToggleButton>
                        <ToggleButton value={CalendarMode.Birthdays} id={CalendarMode.Birthdays.toString()}>Birthdays</ToggleButton>
                        <ToggleButton value={CalendarMode.Cities} id={CalendarMode.Cities.toString()}>Cities</ToggleButton>
                        <ToggleButton value={CalendarMode.Countries} id={CalendarMode.Countries.toString()}>Countries</ToggleButton>
                        <ToggleButton value={CalendarMode.Expenses} id={CalendarMode.Expenses.toString()}>Expenses</ToggleButton>
                        <ToggleButton value={CalendarMode.Locations} id={CalendarMode.Locations.toString()}>Locations</ToggleButton>
                        <ToggleButton value={CalendarMode.Trips} id={CalendarMode.Trips.toString()}>Trips</ToggleButton>
                        <ToggleButton value={CalendarMode.WorkDays} id={CalendarMode.WorkDays.toString()}>Work days</ToggleButton>
                    </ToggleButtonGroup>
                    <Form.Check
                        className="mt-2"
                        type="checkbox"
                        id="show-date-checkbox"
                        label="Show date"
                        checked={showDate}
                        onChange={e => setShowDate(e.target.checked)}
                    />
                    {calendarMode === CalendarMode.Cities &&
                        <AsyncSelect
                            defaultOptions
                            loadOptions={cityLoader}
                            placeholder="Search city by name"
                            onChange={x => setCityId(x.value as string)}
                            styles={reactSelectStyles}
                        />
                    }
                    {calendarMode === CalendarMode.Locations &&
                        <AsyncSelect
                            defaultOptions
                            loadOptions={locationLoader}
                            placeholder="Search location by name"
                            onChange={x => setLocationId(x.value as string)}
                            styles={reactSelectStyles}
                        />
                    }
                </Card.Body>
            </Card>
            <div className="calendar-year-container">
                {months.map(month =>
                    <CalendarMonth
                        dates={calendarDates.filter(x => x.date.month() === month - 1)}
                        isLoading={isLoading}
                        key={month}
                        month={month}
                        selectedDay={selectedDay}
                        showDate={showDate}
                        year={Number(year)}
                        onDaySelect={setSelectedDay}
                        showTrackings={onShowTrackings}
                    />
                )}
            </div>
            {calendarMode === CalendarMode.WorkDays &&
                <WorkDayLegend getCount={getWorkDayTypeCount} />
            }
            <TrackingModal
                isOpen={isMapModalOpen}
                from={trackingDate ?? undefined}
                to={trackingDate ? moment(trackingDate).add(1, 'day').format('YYYY-MM-DD') : undefined}
                onClose={() => setIsMapModalOpen(false)}
            />
        </Container>
    );
}