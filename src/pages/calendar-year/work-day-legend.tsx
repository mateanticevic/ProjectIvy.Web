import React from "react";
import { Card } from "react-bootstrap";

const WORK_DAY_TYPES = [
    { id: "business-trip", label: "Business trip" },
    { id: "conference", label: "Conference" },
    { id: "holiday", label: "Holiday" },
    { id: "medical-check-up", label: "Medical check-up" },
    { id: "office", label: "Office" },
    { id: "remote", label: "Remote" },
    { id: "sick-leave", label: "Sick leave" },
    { id: "unemployed", label: "Unemployed" },
    { id: "vacation", label: "Vacation" },
    { id: "weekend", label: "Week-end" }
];

type WorkDayLegendProps = {
    getCount: (typeId: string) => number;
};

export const WorkDayLegend: React.FC<WorkDayLegendProps> = ({ getCount }) => (
    <Card className="work-day-legend">
        <Card.Body>
            <div className="work-day-legend__items">
                {WORK_DAY_TYPES.map(type => {
                    const count = getCount(type.id);

                    if (count === 0) {
                        return null;
                    }

                    return (
                        <div key={type.id} className="work-day-legend__item">
                            <div className={`calendar-month-day-item ${type.id}`}>
                                {count}
                            </div>
                            <span className="work-day-legend__label">{type.label}</span>
                        </div>
                    );
                })}
            </div>
        </Card.Body>
    </Card>
);
