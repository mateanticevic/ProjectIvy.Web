import * as api from '../config';

const getTimeTotalByDay = (filters) => api.get('web/time/total/byday', filters);

const web = {
    getTimeTotalByDay,
};

export default web;
