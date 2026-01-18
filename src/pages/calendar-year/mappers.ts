import classNames from "classnames";
import moment from "moment";
import { Moment } from "moment";

import { components } from 'types/ivy-types';

type WorkDayType = components['schemas']['WorkDayType'];

export const workDayTypeToStyle = (day: Moment, type: WorkDayType) =>
    classNames({
        'business-trip': type === 'businessTrip',
        'conference': type === 'conference',
        'holiday': type === 'holiday',
        'medical-check-up': type === 'medicalCheckUp',
        'office': type === 'office',
        'remote': type === 'remote',
        'sick-leave': type === 'sickLeave',
        'unemployed': !type,
        'vacation': type === 'vacation',
        'weekend': type !== 'holiday' && day.weekday() >= 5,
    });
