import { boundMethod } from 'autobind-decorator';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Container, Badge, ListGroup, ListGroupItem, OverlayTrigger, Card, Tooltip } from 'react-bootstrap';
import { Marker } from 'react-google-maps';

import api from '~api/main';
import { Map, ValueLabel } from '~components';
import { Module } from '~consts/module';
import { UserContext } from '~contexts/user-context';
import ExpenseTypeLabel from '~pages/expenses/ExpenseTypeLabel';
import OnlineGraph from './OnlineGraph';

class DashboardPage extends React.Component {

    state = {
        carLogLatest: { odometer: 0, timestamp: moment() },
        consumations: [],
        expenses: [],
        distance: {
            month: 0,
            today: 0,
            week: 0,
        },
        movies: [],
        onlineGraphData: [],
        spent: {
            month: 0,
            today: 0,
            week: 0,
        },
        spentByMonthGraphData: [],
    };

    componentDidMount() {
        const lastFiveFilters = {
            pageSize: 5,
        };

        const todayFilters = {
            from: moment().format('YYYY-MM-DD'),
        };

        const weekFilters = {
            from: moment().isoWeekday(1).format('YYYY-MM-DD'),
        };

        const monthFilters = {
            from: moment().date(1).format('YYYY-MM-DD'),
        };

        api.consumation.get(lastFiveFilters).then(consumations => this.setState({ consumations: consumations.items }));
        api.movie.get(lastFiveFilters).then(movies => this.setState({ movies: movies.items }));
        api.tracking.getLastLocation().then(location => this.setState({ location }));
        api.car.getLogLatest('golf-7').then(carLogLatest => this.setState({ carLogLatest }));
        api.web.getTimeTotalByDay(monthFilters).then(onlineGraphData => this.setState({ onlineGraphData }));

        api.expense.get(lastFiveFilters).then(expenses => this.setState({ expenses: expenses.items }));
        api.expense.getSum(todayFilters).then(today => this.setState({ spent: { ...this.state.spent, today } }));
        api.expense.getSum(weekFilters).then(week => this.setState({ spent: { ...this.state.spent, week } }));
        api.expense.getSum(monthFilters).then(month => this.setState({ spent: { ...this.state.spent, month } }));

        api.tracking.getDistance(todayFilters).then(today => this.setState({ distance: { ...this.state.distance, today } }));
        api.tracking.getDistance(weekFilters).then(week => this.setState({ distance: { ...this.state.distance, week } }));
        api.tracking.getDistance(monthFilters).then(month => this.setState({ distance: { ...this.state.distance, month } }));
    }

    render() {
        const user = this.context;
        const { carLogLatest, consumations, distance, expenses, location, movies, onlineGraphData, spent } = this.state;

        const expenseItems = expenses.map(expense => {
            return <ListGroupItem key={_.uniqueId('list_item_')}>
                {this.dayOfWeek(expense.date)} <ExpenseTypeLabel expenseType={expense.expenseType} /><span className="pull-right">{expense.amount} {expense.currency.symbol}</span>
            </ListGroupItem>;
        });

        const movieItems = movies.map(movie => {
            return <ListGroupItem key={_.uniqueId('list_item_')}>
                {this.dayOfWeek(movie.timestamp)} <a href={`http://www.imdb.com/title/${movie.imdbId}`} target="_blank">{movie.title} ({movie.year})</a>
                <span className="pull-right"><Badge variant="primary">{movie.myRating}</Badge></span>
            </ListGroupItem>;
        });

        const consumationItems = consumations.map(consumation => {
            const tooltip = <Tooltip id={_.uniqueId('tooltip_')}>{consumation.serving}</Tooltip>;

            return (
                <ListGroup.Item key={_.uniqueId('list_item_')}>
                    {this.dayOfWeek(consumation.date)} {consumation.beer.name}
                    <OverlayTrigger placement="top" overlay={tooltip}>
                        <span className="pull-right"><Badge variant="primary">{consumation.volume / 1000}L</Badge></span>
                    </OverlayTrigger>
                </ListGroup.Item>
            );
        });

        return (
            <Container>
                <div className="flex-grid">
                    {user.modules.includes(Module.Tracking) && location &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Header>{location.location ? location.location.name : 'Last location'} @ {this.dateTimeFormat(location.tracking.timestamp)}</Card.Header>
                                <Card.Body className="panel-medium padding-0">
                                    {location &&
                                        <Map
                                            defaultCenter={{ lat: location.tracking.lat, lng: location.tracking.lng }}
                                            defaultZoom={15}
                                        >
                                            <Marker position={{ lat: location.tracking.lat, lng: location.tracking.lng }} title="Current location" />
                                        </Map>
                                    }
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    {user.modules.includes(Module.TimeOnline) &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Header>Online last 30 days</Card.Header>
                                <Card.Body className="panel-medium">
                                    <OnlineGraph data={onlineGraphData} />
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    {user.modules.includes(Module.Expenses) &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Header><a href="/expenses">Expenses</a></Card.Header>
                                <Card.Body className="panel-small padding-0">
                                    <ListGroup>
                                        {expenseItems}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    {user.modules.includes(Module.Expenses) &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Header>Spent</Card.Header>
                                <Card.Body className="panel-small padding-0">
                                    <ValueLabel label="Today" unit="kn" value={spent.today} />
                                    <ValueLabel label="This week" unit="kn" value={spent.week} />
                                    <ValueLabel label={moment().format('MMMM')} unit="kn" value={spent.month} />
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    {user.modules.includes(Module.Beer) &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Header><a href="/beer">Beer</a></Card.Header>
                                <Card.Body className="panel-small padding-0">
                                    <ListGroup variant="flush">
                                        {consumationItems}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    {user.modules.includes(Module.Movies) &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Header><a href="/movies">Movies</a></Card.Header>
                                <Card.Body className="panel-small padding-0">
                                    <ListGroup>
                                        {movieItems}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    {user.modules.includes(Module.CarInfo) &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Img variant="top" src="https://wallpaperaccess.com/full/1110034.jpg" />
                                <Card.Body>
                                    <Card.Title>Golf VII 2.0 TDI</Card.Title>
                                    <Card.Text>{carLogLatest.odometer} km</Card.Text>
                                </Card.Body>
                                <Card.Body>
                                    <Card.Link href="/car/golf-7">My car</Card.Link>
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    {user.modules.includes(Module.Tracking) &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Header>Distance</Card.Header>
                                <Card.Body className="panel-small padding-0">
                                    <ValueLabel label="Today" unit="km" value={distance.today / 1000} />
                                    <ValueLabel label="This week" unit="km" value={distance.week / 1000} />
                                    <ValueLabel label={moment().format('MMMM')} unit="km" value={distance.month / 1000} />
                                </Card.Body>
                            </Card>
                        </div>
                    }
                </div>
            </Container>
        );
    }

    @boundMethod
    private dateTimeFormat(dateTime) {
        return moment(dateTime).date() === moment().date() ? `Today ${moment(dateTime).format('H:mm')}` : moment(dateTime).format('MMMM Do H:mm');
    }

    private dayOfWeek(date) {
        const fullDate = (
            <Tooltip id="tooltip">
                {moment(date).format('Do MMMM YYYY')}
            </Tooltip>
        );

        return (
            <OverlayTrigger placement="top" overlay={fullDate}>
                <Badge variant="primary">
                    {moment(date).format('ddd')}
                </Badge>
            </OverlayTrigger>
        );
    }
}

DashboardPage.contextType = UserContext;

export default DashboardPage;
