import * as api from '../config';

interface WebFilters {
    From?: string;
    To?: string;
    OrderAscending?: boolean;
}

const getTimeTotalByDay = (filters?: WebFilters) => api.get('web/time/total/byday', filters);

const web = {
    getTimeTotalByDay,
};

export default web;
