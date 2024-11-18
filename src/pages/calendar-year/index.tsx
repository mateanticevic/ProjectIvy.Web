import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { CalendarMonth } from "./calendar-month";
import api from "api/main";
import AsyncSelect from "react-select/async";
import { locationLoader } from "utils/select-loaders";
import { components } from 'types/ivy-types';

type WorkDay = {
    date: string;
    workDay: string;
}

export const CalendarYearPage = () => {

    const { year } = useParams<{ year: string }>();
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const [highlightedDates, setHighlightedDates] = useState([] as string[]);

    const onLocationSelected = (locationId: string) => {
        api.location.getDays(locationId)
            .then(highlightedDates => {
                setHighlightedDates(highlightedDates);
            });
    };

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
                        year={Number(year)}
                    />
                )}
            </div>
        </Container>
    );
}