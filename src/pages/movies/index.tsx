import React from 'react';
import moment from 'moment';
import { Badge, Card, Col, Container, Row, Table } from 'react-bootstrap';
import 'rc-slider/assets/index.css';
import { FaImdb } from 'react-icons/fa';

import { DistributionCard } from '../../components/DistributionCard';
import Pagination from '../../components/Pagination';
import api from '../../api/main';
import { MovieGroupBy } from '../../consts/groupings';
import { Page } from '../Page';
import { MovieFilters } from 'types/movies';
import { FilterCard } from './FilterCard';

interface State {
    countChartData: any;
    filters: MovieFilters;
    movieGroupBy: MovieGroupBy;
    movies: any;
}

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
}

class MoviesPage extends Page<{}, State> {
    state: State = {
        countChartData: [],
        filters: {
            page: 1,
            pageSize: 10,
            ratingHigher: 1,
            ratingLower: 10,
            runtimeLonger: 1,
            runtimeShorter: 300,
        },
        movieGroupBy: MovieGroupBy.ByYear,
        movies: {
            count: 0,
            items: [],
        }
    }

    async componentDidMount() {
        this.onFiltersChanged();
    }

    render() {
        const { filters, movies } = this.state;

        return (
            <Container>
                <Row>
                    <Col lg={3}>
                        <FilterCard
                            filters={filters}
                            onFiltersChanged={this.onFiltersChanged}
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
                                                <td><a target="_blank" href={`http://www.imdb.com/title/${movie.imdbId}`}><FaImdb size="20" /></a></td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <Pagination
                                        page={filters.page}
                                        pages={Math.ceil(movies.count / filters.pageSize)}
                                        onPageChange={page => this.onFiltersChanged({ page })}
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
                            data={this.state.countChartData}
                            name="Count"
                            onGroupByChange={this.onCountGroupByChange}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }

    onCountGroupByChange = (movieGroupBy: MovieGroupBy) => {
        this.setState({ movieGroupBy });
        maps[movieGroupBy](this.state.filters).then(countChartData => this.setState({ countChartData }));
    }

    onFiltersChanged = (changedFilters?: Partial<MovieFilters>) => {
        const filters = this.resolveFilters(this.state.filters, changedFilters);
        this.pushHistoryState(filters);
        this.setState({
            filters,
        }, () => this.onCountGroupByChange(this.state.movieGroupBy));

        api.movie
            .get(filters)
            .then(movies => this.setState({ movies }));
    }
}

export default MoviesPage;