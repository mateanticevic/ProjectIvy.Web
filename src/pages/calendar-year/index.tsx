import React from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { CalendarMonth } from "./calendar-month";

export const CalendarYearPage = () => {

    const { year } = useParams<{ year: string }>();
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <Container>
            <h1>{year}</h1>
            <div className="calendar-year-container">
                {months.map(month =>
                    <CalendarMonth
                        key={month}
                        month={month}
                        year={Number(year)}
                    />
                )}
            </div>
        </Container>
    );
}