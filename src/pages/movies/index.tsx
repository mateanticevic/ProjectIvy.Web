import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { DistributionCard } from '../../components/DistributionCard';
import api from '../../api/main';
import { GroupByTime } from '../../consts/groupings';

interface State {
    countChartData: any;
}

const maps = {
    [GroupByTime.ByDayOfWeek]: api.movie.getCountByDayOfWeek,
    [GroupByTime.ByYear]: api.movie.getCountByYear,
    [GroupByTime.ByMonth]: api.movie.getCountByMonth,
    [GroupByTime.ByMonthOfYear]: api.movie.getCountByMonthOfYear,
}

class MoviesPage extends React.Component<{}, State> {

    state: State = {
        countChartData: []
    }

    async componentDidMount() {
        this.onCountGroupByChange(GroupByTime.ByYear);
    }

    render() {

        const countByOptions = [
            { value: GroupByTime.ByYear, name: 'Year' },
            { value: GroupByTime.ByMonth, name: 'Month' },
            { value: GroupByTime.ByMonthOfYear, name: 'Month of Year' },
            { value: GroupByTime.ByDayOfWeek, name: 'Day of Week' },
        ];
        return (
            <Container>
                <Row><h1>Movies</h1></Row>
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

    onCountGroupByChange = (groupBy: GroupByTime) => {
        maps[groupBy]().then(countChartData => this.setState({ countChartData }));
    }
}

export default MoviesPage;