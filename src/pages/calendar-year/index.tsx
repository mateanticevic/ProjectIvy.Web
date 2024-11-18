import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { CalendarMonth } from "./calendar-month";
import api from "api/main";
import AsyncSelect from "react-select/async";
import { locationLoader } from "utils/select-loaders";
import { components } from 'types/ivy-types';
import { CalendarDateFlag, CalendarDateIntensity, CalendarDateStyle, CalendarMode } from "./constants";
import moment from "moment";
import { workDayTypeToStyle } from "./mappers";

type WorkDay = components['schemas']['WorkDay'];

export const CalendarYearPage = () => {

    const { year } = useParams<{ year: string }>();
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const [calendarMode, setCalendarMode] = useState<CalendarMode>(CalendarMode.Styles);
    const [highlightedDates, setHighlightedDates] = useState([] as string[]);
    const [workDays, setWorkDays] = useState([] as WorkDay[]);
    const [calendarDates, setCalendarDates] = useState([] as (CalendarDateFlag[] | CalendarDateIntensity[] | CalendarDateStyle[]));

    const onLocationSelected = (locationId: string) => {
        api.location.getDays(locationId)
            .then(setHighlightedDates);
    };

    useEffect(() => {
        api.workDay.get({ from: `${year}-01-01`, to: `${year}-12-31` })
            .then(workDays => {
                setCalendarDates(workDays.map(x => ({
                    date: moment(x.date),
                    style: workDayTypeToStyle(moment(x.date), x.type!)
                })) as CalendarDateStyle[]);
            });
    }, []);

    return (
        <Container>
            <h1>{year}</h1>
            <AsyncSelect
                defaultOptions
                loadOptions={locationLoader}
                placeholder="Search location by name"
                onChange={x => onLocationSelected(x.value)}
            />
            <div className="calendar-year-container">
                {months.map(month =>
                    <CalendarMonth
                        calendarMode={calendarMode}
                        dates={calendarDates}
                        key={month}
                        month={month}
                        year={Number(year)}
                    />
                )}
            </div>
        </Container>
    );
}