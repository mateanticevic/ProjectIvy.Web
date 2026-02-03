import React, { useEffect, useState } from "react";
import { Container, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import moment from "moment";

import { CalendarMonth } from "./calendar-month";
import api from "api/main";
import AsyncSelect from "react-select/async";
import { cityLoader, locationLoader } from "utils/select-loaders";
import { useReactSelectStyles } from "utils/react-select-dark-theme";
import { CalendarDateBinary, CalendarDateFlag, CalendarDateIntensity, CalendarDateStyle, CalendarDateValue, CalendarMode } from "./constants";
import { workDayTypeToStyle } from "./mappers";
import { WorkDayLegend } from "./work-day-legend";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { set } from "lodash";

export const CalendarYearPage = () => {

    const { year: yearFromParam } = useParams<{ year: string }>();
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const reactSelectStyles = useReactSelectStyles();

    const [calendarMode, setCalendarMode] = useState<CalendarMode>(CalendarMode.WorkDays);
    const [calendarDates, setCalendarDates] = useState([] as (CalendarDateBinary[] | CalendarDateIntensity[] | CalendarDateStyle[] | CalendarDateFlag[]));
    const [cityId, setCityId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [locationId, setLocationId] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [year, setYear] = useState(parseInt(yearFromParam ?? moment().year().toString()));
    window.history.replaceState(null, '', `/calendar/${year}`);

    const getWorkDayTypeCount = (typeId: string) =>
        calendarDates.filter(x => (x as CalendarDateStyle).style === typeId).length;

    const onLocationSelected = (locationId: string, year: number) => {
        setLocationId(locationId);
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

    const onModeChange = (mode: CalendarMode) => {
        setCalendarMode(mode);
        load(mode);
    };

    const load = (mode: CalendarMode) => {
        if (mode === CalendarMode.Countries) {
            loadCountries();
        }
        else if (mode === CalendarMode.WorkDays) {
            loadWorkDays();
        }
        else if (mode === CalendarMode.Beer) {
            loadBeer();
        }
        else if (mode === CalendarMode.Expenses) {
            loadExpenses();
        }
    };

    const onCitySelected = (cityId: string, year: number) => {
        setCityId(cityId);
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

    const onYearChange = (year: number) => {
        setYear(year);

        if (locationId && calendarMode === CalendarMode.Locations) {
            onLocationSelected(locationId, year);
        }
        if (calendarMode === CalendarMode.Cities && cityId) {
            onCitySelected(cityId, year);
        }
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
                const results = [] as CalendarDateIntensity[];
                for (let date = moment(`${year}-01-01`); !date.isSame(moment(`${year}-12-31`), 'day'); date = date.add(1, 'day')) {
                    const value = expenseByDay.find(x => x.key === date.format('YYYY-MM-DD 00:00:00.000'))?.value ?? 0;
                    let intensity = 0;
                    if (value > 0) {
                        intensity = Math.min(value / 300, 1); // 0 < intensity <= 1
                    }
                    results.push({
                        date: date.clone(),
                        intensity
                    });
                }
                setCalendarDates(results.reverse());
                setIsLoading(false);
            });
    };

    useEffect(() => {
        onModeChange(calendarMode);
    }, [year]);

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
            <h1>
                <IoMdArrowDropleft onClick={() => onYearChange(year - 1)} />
                {year}
                {year !== moment().year() &&
                    <IoMdArrowDropright onClick={() => onYearChange(year + 1)} />
                }
            </h1>
            <ToggleButtonGroup name="options" type="radio" value={calendarMode} onChange={onModeChange}>
                <ToggleButton value={CalendarMode.Beer} id={CalendarMode.Beer.toString()}>Beer</ToggleButton>
                <ToggleButton value={CalendarMode.Cities} id={CalendarMode.Cities.toString()}>Cities</ToggleButton>
                <ToggleButton value={CalendarMode.Countries} id={CalendarMode.Countries.toString()}>Countries</ToggleButton>
                <ToggleButton value={CalendarMode.Expenses} id={CalendarMode.Expenses.toString()}>Expenses</ToggleButton>
                <ToggleButton value={CalendarMode.Locations} id={CalendarMode.Locations.toString()}>Locations</ToggleButton>
                <ToggleButton value={CalendarMode.WorkDays} id={CalendarMode.WorkDays.toString()}>Work days</ToggleButton>
            </ToggleButtonGroup>
            {calendarMode === CalendarMode.Cities &&
                <AsyncSelect
                    defaultOptions
                    loadOptions={cityLoader}
                    placeholder="Search city by name"
                    onChange={x => onCitySelected(x.value, year)}
                    styles={reactSelectStyles}
                />
            }
            {calendarMode === CalendarMode.Locations &&
                <AsyncSelect
                    defaultOptions
                    loadOptions={locationLoader}
                    placeholder="Search location by name"
                    onChange={x => onLocationSelected(x.value, year)}
                    styles={reactSelectStyles}
                />
            }
            <div className="calendar-year-container">
                {months.map(month =>
                    <CalendarMonth
                        dates={calendarDates.filter(x => x.date.month() === month - 1)}
                        isLoading={isLoading}
                        key={month}
                        month={month}
                        selectedDay={selectedDay}
                        year={Number(year)}
                        onDaySelect={setSelectedDay}
                    />
                )}
            </div>
            {calendarMode === CalendarMode.WorkDays &&
                <WorkDayLegend getCount={getWorkDayTypeCount} />
            }
        </Container>
    );
}