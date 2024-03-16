import { components } from 'types/ivy-types';

import * as api from '../config';

type CalendarSection = components['schemas']['CalendarSection'];

const getSection = (from: string, to: string): Promise<CalendarSection> => api.get(`calendar/section`, { from, to });

const patch = (date: string, workDayTypeId: string) => api.patch(`calendar/${date}`, { workDayTypeId });

const calendar = {
    getSection,
    patch,
};

export default calendar;
