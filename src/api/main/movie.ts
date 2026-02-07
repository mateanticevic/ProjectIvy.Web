import { MovieFilters } from 'types/movies';
import { components, paths } from 'types/ivy-types';
import * as api from '../config';

type MoviePagedView = components['schemas']['MoviePagedView'];
type GetMovieQuery = paths['/Movie']['get']['parameters']['query'];

const get = (filters: MovieFilters): Promise<MoviePagedView> => api.get('movie', filters);

const getCountByDay = (filters: MovieFilters) => api.get('movie/count/byDay', filters);

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
    getCountByDay,
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
