import * as api from '../config';

function getTimeTotalByDay(filters) {
    return api.get('web/time/total/byday', filters);
}

const web = {
    getTimeTotalByDay,
};

export default web;
