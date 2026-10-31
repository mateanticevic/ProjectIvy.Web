import moment from 'moment';
import { components } from 'types/ivy-types';

type Stay = components['schemas']['Stay'];
type StayTimelineItem = { stay: Stay } | { from: string; to: string };

export const getStayTimeline = (stays: Stay[], from?: string, to?: string): StayTimelineItem[] => {
    const items: StayTimelineItem[] = [];
    const tripStart = moment(from).startOf('day');
    const tripEnd = moment(to).startOf('day');
    let cursor = tripStart.clone();
    const hasRange = !!from && !!to && tripStart.isValid() && tripEnd.isValid();

    [...stays].sort((a, b) => moment(a.from).valueOf() - moment(b.from).valueOf()).forEach(stay => {
        const start = moment(stay.from).startOf('day');
        const end = moment(stay.to).startOf('day');
        const gapEnd = moment.min(start, tripEnd);
        if (hasRange && stay.from && cursor.isBefore(gapEnd, 'day')) {
            items.push({ from: cursor.format('YYYY-MM-DD'), to: gapEnd.format('YYYY-MM-DD') });
        }
        items.push({ stay });
        if (stay.to && end.isValid()) {
            cursor = moment.max(cursor, end);
        }
    });

    if (hasRange && cursor.isBefore(tripEnd, 'day')) {
        items.push({ from: cursor.format('YYYY-MM-DD'), to: tripEnd.format('YYYY-MM-DD') });
    }
    return items;
};
