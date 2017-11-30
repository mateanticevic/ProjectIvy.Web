import * as api from '../config';

export function getTimeTotalByDay(filters) {
    return api.get("web/time/total/byday", filters);
}