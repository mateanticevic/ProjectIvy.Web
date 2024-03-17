import { components } from 'types/ivy-types';

import * as api from '../config';

type CalendarSection = components['schemas']['CalendarSection'];

const getDays = (from: string, to: string): Promise<CalendarSection> => api.get(`calendar/days`, { from, to });

const patch = (date: string, workDayTypeId: string) => api.patch(`calendar/${date}`, { workDayTypeId });

const calendar = {
    getDays,
    patch,
};

export default calendar;
