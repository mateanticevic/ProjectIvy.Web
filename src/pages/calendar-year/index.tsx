import React, { useEffect, useState } from "react";
import { Container, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { CalendarMonth } from "./calendar-month";
import api from "api/main";
import AsyncSelect from "react-select/async";
import { cityLoader, locationLoader } from "utils/select-loaders";
import { CalendarDateBinary, CalendarDateFlag, CalendarDateIntensity, CalendarDateStyle, CalendarDateValue, CalendarMode } from "./constants";
import moment from "moment";
import { workDayTypeToStyle } from "./mappers";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

export const CalendarYearPage = () => {

    const { year: yearFromParam } = useParams<{ year: string }>();
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const [calendarMode, setCalendarMode] = useState<CalendarMode>(CalendarMode.WorkDays);
    const [calendarDates, setCalendarDates] = useState([] as (CalendarDateBinary[] | CalendarDateIntensity[] | CalendarDateStyle[] | CalendarDateFlag[]));
    const [year, setYear] = useState(parseInt(yearFromParam!) ?? moment().year());

    const onLocationSelected = (locationId: string) => {
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
            });
    };

    const onModeChange = (mode: CalendarMode) => {
        setCalendarMode(mode);

        if (mode === CalendarMode.Countries) {
            loadCountries();
        }
        else if (mode === CalendarMode.WorkDays) {
            loadWorkDays();
        }
        else if (mode === CalendarMode.Beer) {
            loadBeer();
        }
    };

    const onCitySelected = (cityId: string) => {
        api.city.getDays(cityId, { from: `${year}-01-01`, to: `${year}-12-31` })
            .then(dates => {
                const results = [] as CalendarDateBinary[];
                for (let date = moment(`${year}-01-01`); !date.isSame(moment(`${year}-12-31`), 'day'); date = date.add(1, 'day')) {
                    results.push({
                        date: date.clone(),
                        active: dates.some(x => x === date.format('YYYY-MM-DD 00:00:00'))
                    });
                }
                setCalendarDates(results.reverse());
            });
    };

    const loadBeer = () => {
        api.consumation.getSumByDay({ from: `${year}-01-01`, to: `${year}-12-31` })
            .then(volumeByDay => {
                const results = [] as CalendarDateValue[];
                for (let date = moment(`${year}-01-01`); !date.isSame(moment(`${year}-12-31`), 'day'); date = date.add(1, 'day')) {
                    results.push({
                        date: date.clone(),
                        value: volumeByDay.find(x => x.key === date.format('YYYY-MM-DD 00:00:00'))?.value ?? 0
                    });
                }
                setCalendarDates(results.reverse());
            });
    };

    const loadCountries = () => {
        api.country.getVisitedByDay({ from: `${year}-01-01`, to: `${year}-12-31` })
            .then(countriesByDay => {
                const results = [] as CalendarDateFlag[];
                for (let date = moment(`${year}-01-01`); !date.isSame(moment(`${year}-12-31`), 'day'); date = date.add(1, 'day')) {
                    results.push({
                        date: date.clone(),
                        countryId: countriesByDay.find(x => x.key === date.format('YYYY-MM-DD 00:00:00'))?.value?.filter(x => x !== 'HR')[0]
                    });
                }
                setCalendarDates(results.reverse());
            });
    };

    const loadWorkDays = () => {
        api.workDay.get({ from: `${year}-01-01`, to: `${year}-12-31` })
            .then(workDays => {
                setCalendarDates(workDays.map(x => ({
                    date: moment(x.date),
                    style: workDayTypeToStyle(moment(x.date), x.type!)
                })) as CalendarDateStyle[]);
            });
    };

    useEffect(() => {
        onModeChange(calendarMode);
    }, [year]);

    useEffect(() => {
        loadWorkDays();
    }, []);

    return (
        <Container>
            <h1>
                <IoMdArrowDropleft onClick={() => setYear(year - 1)} />
                {year}
                {year !== moment().year() &&
                    < IoMdArrowDropright onClick={() => setYear(year + 1)} />
                }
            </h1>
            <ToggleButtonGroup name="options" type="radio" value={calendarMode} onChange={onModeChange}>
                <ToggleButton value={CalendarMode.Beer} id={CalendarMode.Beer.toString()}>Beer</ToggleButton>
                <ToggleButton value={CalendarMode.Cities} id={CalendarMode.Cities.toString()}>Cities</ToggleButton>
                <ToggleButton value={CalendarMode.Countries} id={CalendarMode.Countries.toString()}>Countries</ToggleButton>
                <ToggleButton value={CalendarMode.Locations} id={CalendarMode.Locations.toString()}>Locations</ToggleButton>
                <ToggleButton value={CalendarMode.WorkDays} id={CalendarMode.WorkDays.toString()}>Work days</ToggleButton>
            </ToggleButtonGroup>
            {calendarMode === CalendarMode.Cities &&
                <AsyncSelect
                    defaultOptions
                    loadOptions={cityLoader}
                    placeholder="Search city by name"
                    onChange={x => onCitySelected(x.value)}
                />
            }
            {calendarMode === CalendarMode.Locations &&
                <AsyncSelect
                    defaultOptions
                    loadOptions={locationLoader}
                    placeholder="Search location by name"
                    onChange={x => onLocationSelected(x.value)}
                />
            }
            <div className="calendar-year-container">
                {months.map(month =>
                    <CalendarMonth
                        dates={calendarDates.filter(x => x.date.month() === month - 1)}
                        key={month}
                        month={month}
                        year={Number(year)}
                    />
                )}
            </div>
            {calendarMode === CalendarMode.WorkDays &&
                <>
                    <div><div className="calendar-month-day-item business-trip"></div><h6>Business trip</h6></div>
                    <div><div className="calendar-month-day-item conference"></div><h6>Conference</h6></div>
                    <div><div className="calendar-month-day-item holiday"></div><h6>Holiday</h6></div>
                    <div><div className="calendar-month-day-item medical-check-up"></div><h6>Medical check-up</h6></div>
                    <div><div className="calendar-month-day-item office"></div><h6>Office</h6></div>
                    <div><div className="calendar-month-day-item remote"></div><h6>Remote</h6></div>
                    <div><div className="calendar-month-day-item sick-leave"></div><h6>Sick leave</h6></div>
                    <div><div className="calendar-month-day-item vacation"></div><h6>Vacation</h6></div>
                    <div><div className="calendar-month-day-item weekend"></div><h6>Week-end</h6></div>
                </>
            }
        </Container>
    );
}