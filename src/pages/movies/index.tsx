import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Badge, Card, Col, Container, Row, Table } from 'react-bootstrap';
import 'rc-slider/assets/index.css';
import { FaImdb } from 'react-icons/fa';
import { SiPlex } from 'react-icons/si';

import api from 'api/main';
import { DistributionCard, Pagination } from 'components';
import { MovieGroupBy } from 'consts/groupings';
import { MovieFilters } from 'types/movies';
import { FilterCard } from './filter-card';
import { PagedList } from 'types/common';
import { KeyValuePair } from 'types/grouping';
import { components } from 'types/ivy-types';
import CalendarGrid from 'components/calendar-grid';
import * as urlHelper from 'utils/url-helper';

type Movie = components['schemas']['Movie'];

const countByOptions = [
    { value: MovieGroupBy.ByYear, name: 'Year' },
    { value: MovieGroupBy.ByMonth, name: 'Month' },
    { value: MovieGroupBy.ByMonthOfYear, name: 'Month of Year' },
    { value: MovieGroupBy.ByDayOfWeek, name: 'Day of Week' },
    { value: MovieGroupBy.ByMyRating, name: 'My Rating' },
    { value: MovieGroupBy.ByMyRatingPerYear, name: 'My Rating per Year' },
    { value: MovieGroupBy.ByMovieDecade, name: 'Movie Decade' },
    { value: MovieGroupBy.ByMovieYear, name: 'Movie Year' },
    { value: MovieGroupBy.ByRatingPerYear, name: 'Rating per Year' },
    { value: MovieGroupBy.ByRuntime, name: 'Runtime' },
];

const maps = {
    [MovieGroupBy.ByDayOfWeek]: api.movie.getCountByDayOfWeek,
    [MovieGroupBy.ByYear]: api.movie.getCountByYear,
    [MovieGroupBy.ByMonth]: api.movie.getCountByMonth,
    [MovieGroupBy.ByMonthOfYear]: api.movie.getCountByMonthOfYear,
    [MovieGroupBy.ByMyRating]: api.movie.getCountByMyRating,
    [MovieGroupBy.ByMyRatingPerYear]: api.movie.getMyRatingAverageByYear,
    [MovieGroupBy.ByMovieDecade]: api.movie.getCountByMovieDecade,
    [MovieGroupBy.ByMovieYear]: api.movie.getCountByMovieYear,
    [MovieGroupBy.ByRatingPerYear]: api.movie.getRatingAverageByYear,
    [MovieGroupBy.ByRuntime]: api.movie.getCountByRuntime,
};

const MoviesPage: React.FC = () => {
    const [countByDay, setCountByDay] = useState<KeyValuePair<number>[]>([]);
    const [countChartData, setCountChartData] = useState<any>([]);
    const [filters, setFilters] = useState<MovieFilters>({
        page: 1,
        pageSize: 10,
        ratingHigher: 1,
        ratingLower: 10,
        runtimeLonger: 1,
        runtimeShorter: 300,
    });
    const [movieGroupBy, setMovieGroupBy] = useState<MovieGroupBy>(MovieGroupBy.ByYear);
    const [movies, setMovies] = useState<PagedList<Movie>>({
        count: 0,
        items: [],
    });

    const pushHistoryState = (filters: MovieFilters) => {
        const queryString = urlHelper.jsonToQueryString(filters);
        const state = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
        window.history.pushState(null, null, state);
    };

    const resolveFilters = (currentFilters: MovieFilters, filterValue?: Partial<MovieFilters>): MovieFilters => {
        return filterValue ? {
            ...currentFilters,
            ...filterValue
        } : {
            ...currentFilters,
            ...(urlHelper.queryStringToJson(window.location.search))
        };
    };

    const onCountGroupByChange = useCallback((newMovieGroupBy: MovieGroupBy) => {
        setMovieGroupBy(newMovieGroupBy);
        maps[newMovieGroupBy](filters).then(data => setCountChartData(data));
    }, [filters]);

    const onFiltersChanged = useCallback((changedFilters?: Partial<MovieFilters>) => {
        const newFilters = resolveFilters(filters, changedFilters);
        pushHistoryState(newFilters);
        setFilters(newFilters);

        maps[movieGroupBy](newFilters).then(data => setCountChartData(data));

        api.movie
            .get(newFilters)
            .then(moviesData => setMovies(moviesData));

        api.movie
            .getCountByDay(newFilters)
            .then(data => setCountByDay(data));
    }, [filters, movieGroupBy]);

    useEffect(() => {
        onFiltersChanged();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container>
            <Row>
                <Col lg={3}>
                    <FilterCard
                        filters={filters}
                        onFiltersChanged={onFiltersChanged}
                    />
                </Col>
                <Col lg={9}>
                    <Card>
                        <Card.Header>Movies ({movies.count})</Card.Header>
                        <Card.Body>
                            <Table responsive>
                                <tbody>
                                    {movies.items.map(movie =>
                                        <tr key={movie.imdbId}>
                                            <td>{moment(movie.timestamp).format('Do MMMM YYYY')}</td>
                                            <td><Badge variant="primary">{movie.year}</Badge></td>
                                            <td>{movie.title}</td>
                                            <td>{movie.runtime}min</td>
                                            <td><Badge variant="primary">{movie.myRating}</Badge></td>
                                            <td><a target="_blank" href={`http://www.imdb.com/title/${movie.imdbId}`} rel="noreferrer"><FaImdb size="20" /></a></td>
                                            <td><a target="_blank" href={`https://plex.anticevic.net/web/index.html#!/search?query=${encodeURIComponent(movie.title)}`} rel="noreferrer"><SiPlex size="20" /></a></td>
                                        </tr>
                                    )}
                                </tbody>
                                <Pagination
                                    page={filters.page}
                                    pages={Math.ceil(movies.count / filters.pageSize)}
                                    onPageChange={page => onFiltersChanged({ page })}
                                />
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    <DistributionCard
                        countByOptions={countByOptions}
                        data={countChartData}
                        name="Count"
                        onGroupByChange={onCountGroupByChange}
                    />
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    <Card>
                        <Card.Header>Calendar</Card.Header>
                        <Card.Body>
                            <CalendarGrid
                                dates={countByDay}
                                renderTooltip={(date, value) => `On ${date}, watched ${value}`}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default MoviesPage;