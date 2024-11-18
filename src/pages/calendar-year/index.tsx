import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { CalendarMonth } from "./calendar-month";
import api from "api/main";
import AsyncSelect from "react-select/async";
import { locationLoader } from "utils/select-loaders";
import { components } from 'types/ivy-types';

type WorkDay = components['schemas']['WorkDay'];

export const CalendarYearPage = () => {

    const { year } = useParams<{ year: string }>();
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const [highlightedDates, setHighlightedDates] = useState([] as string[]);
    const [workDays, setWorkDays] = useState([] as WorkDay[]);

    const onLocationSelected = (locationId: string) => {
        api.location.getDays(locationId)
            .then(setHighlightedDates);
    };

    useEffect(() => {
        api.workDay.get({ from: `${year}-01-01`, to: `${year}-12-31` })
            .then(setWorkDays);
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
                        key={month}
                        highlightedDates={highlightedDates}
                        month={month}
                        workDays={workDays}
                        year={Number(year)}
                    />
                )}
            </div>
        </Container>
    );
}