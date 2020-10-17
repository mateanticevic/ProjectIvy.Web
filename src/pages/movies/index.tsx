import React from 'react';
import moment from 'moment';
import { Badge, Card, Col, Container, FormGroup, FormLabel, Row, Table } from 'react-bootstrap';
import Datetime from 'react-datetime';
import 'rc-slider/assets/index.css';
import { FaImdb } from 'react-icons/fa';

import { DistributionCard } from '../../components/DistributionCard';
import api from '../../api/main';
import { MovieGroupBy } from '../../consts/groupings';
import { Page } from '../Page';
import { MovieFilters } from 'types/movies';
import { Range } from 'rc-slider';
import { Select } from '../../components';

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
    { value: MovieGroupBy.ByMovieDecade, name: 'Movie Decade' },
    { value: MovieGroupBy.ByMovieYear, name: 'Movie Year' },
    { value: MovieGroupBy.ByRuntime, name: 'Runtime' },
];

const orderByOptions = [
    { id: 'rating', name: 'Rating' },
    { id: 'myRating', name: 'My Rating' },
    { id: 'myRatingDifference', name: 'My Rating Difference' },
];

const maps = {
    [MovieGroupBy.ByDayOfWeek]: api.movie.getCountByDayOfWeek,
    [MovieGroupBy.ByYear]: api.movie.getCountByYear,
    [MovieGroupBy.ByMonth]: api.movie.getCountByMonth,
    [MovieGroupBy.ByMonthOfYear]: api.movie.getCountByMonthOfYear,
    [MovieGroupBy.ByMyRating]: api.movie.getCountByMyRating,
    [MovieGroupBy.ByMovieDecade]: api.movie.getCountByMovieDecade,
    [MovieGroupBy.ByMovieYear]: api.movie.getCountByMovieYear,
    [MovieGroupBy.ByRuntime]: api.movie.getCountByRuntime,
}

const dateFormat = 'YYYY-M-D';

class MoviesPage extends Page<{}, State> {
    state: State = {
        countChartData: [],
        filters: {
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
                        <Card>
                            <Card.Header>Filter</Card.Header>
                            <Card.Body>
                                <FormGroup>
                                    <FormLabel>From</FormLabel>
                                    <Datetime
                                        dateFormat={dateFormat}
                                        timeFormat={false}
                                        onChange={from => this.onFiltersChanged({ from: from.format(dateFormat) })}
                                        value={filters.from}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>To</FormLabel>
                                    <Datetime
                                        dateFormat={dateFormat}
                                        timeFormat={false}
                                        onChange={to => this.onFiltersChanged({ to: to.format(dateFormat) })}
                                        value={filters.to}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Rating</FormLabel>
                                    <Range
                                        max={10}
                                        marks={{
                                            1: '1',
                                            10: '10',
                                        }}
                                        min={1}
                                        onChange={c => this.onFiltersChanged({ ratingLower: c[1], ratingHigher: c[0] })}
                                        step={0.1}
                                        value={[filters.ratingHigher, filters.ratingLower]}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Runtime</FormLabel>
                                    <Range
                                        max={300}
                                        marks={{
                                            1: '1m',
                                            300: '5h',
                                        }}
                                        min={1}
                                        onChange={c => this.onFiltersChanged({ runtimeShorter: c[1], runtimeLonger: c[0] })}
                                        step={1}
                                        value={[filters.runtimeLonger, filters.runtimeShorter]}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Order By</FormLabel>
                                    <Select
                                        options={orderByOptions}
                                        onChange={orderBy => this.onFiltersChanged({ orderBy })}
                                    />
                                </FormGroup>
                            </Card.Body>
                        </Card>
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