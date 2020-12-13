import { MovieFilters } from 'types/movies';
import * as api from '../config';

const get = (filters: MovieFilters) => api.get('movie', filters);

const getCountByDayOfWeek = (filters: MovieFilters) => api.get('movie/count/byDayOfWeek', filters);

const getCountByMonth = (filters: MovieFilters) => api.get('movie/count/byMonth', filters);

const getCountByMonthOfYear = (filters: MovieFilters) => api.get('movie/count/byMonthOfYear', filters);

const getCountByMovieDecade = (filters: MovieFilters) => api.get('movie/count/byMovieDecade', filters);

const getCountByMovieYear = (filters: MovieFilters) => api.get('movie/count/byMovieYear', filters);

const getCountByMyRating = (filters: MovieFilters) => api.get('movie/count/byMyRating', filters);

const getCountByRuntime = (filters: MovieFilters) => api.get('movie/count/byRuntime', filters);

const getCountByYear = (filters: MovieFilters) => api.get('movie/count/byYear', filters);

const getMyRatingAverageByYear = (filters: MovieFilters) => api.get('movie/myRating/byYear', filters);

const getRatingAverageByYear = (filters: MovieFilters) => api.get('movie/rating/byYear', filters);

const movie = {
    get,
    getCountByDayOfWeek,
    getCountByMonth,
    getCountByMonthOfYear,
    getCountByMovieDecade,
    getCountByMovieYear,
    getCountByMyRating,
    getCountByRuntime,
    getCountByYear,
    getMyRatingAverageByYear,
    getRatingAverageByYear,
};

export default movie;
