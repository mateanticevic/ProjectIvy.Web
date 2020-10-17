import React from 'react';
import moment from 'moment';
import { Badge, Card, Col, Container, Row, Table } from 'react-bootstrap';

import { DistributionCard } from '../../components/DistributionCard';
import api from '../../api/main';
import { MovieGroupBy } from '../../consts/groupings';
import { Page } from '../Page';
import { MovieFilters } from 'types/movies';

interface State {
    countChartData: any;
    filters: MovieFilters;
    movieGroupBy: MovieGroupBy;
    movies: any;
}

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

class MoviesPage extends Page<{}, State> {

    state: State = {
        countChartData: [],
        filters: {},
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

        const { movies } = this.state;

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
        return (
            <Container>
                <Row>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Filter</Card.Header>
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