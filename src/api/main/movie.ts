import * as api from '../config';

function get(filters) {
    return api.get('movie', filters);
}

const getCountByDayOfWeek = () => api.get('movie/count/byDayOfWeek');

const getCountByMonth = () => api.get('movie/count/byMonth');

const getCountByMonthOfYear = () => api.get('movie/count/byMonthOfYear');

const getCountByYear = () => api.get('movie/count/byYear');

const movie = {
    get,
    getCountByDayOfWeek,
    getCountByMonth,
    getCountByMonthOfYear,
    getCountByYear,
};

export default movie;
