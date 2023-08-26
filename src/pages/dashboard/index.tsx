import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Container, Badge, ListGroup, ListGroupItem, OverlayTrigger, Card, Tooltip } from 'react-bootstrap';
import { Marker } from 'react-google-maps';

import api from 'api/main';
import { Map, ValueLabel } from 'components';
import { UserContext } from 'contexts/user-context';
import ExpenseTypeLabel from 'pages/expenses/expense-type-label';
import { getIdentity } from 'utils/cookie-helper';
import { Feature, User } from 'types/users';

class DashboardPage extends React.Component {
    identity = getIdentity();
    user: User;

    state = {
        carLog: { odometer: 0, timestamp: moment() },
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

    async componentDidMount() {
        this.user = this.context;

        const lastFiveFilters = {
            pageSize: 5,
        };

        const todayFilters = {
            from: moment().format('YYYY-MM-DD')
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
        api.web.getTimeTotalByDay(monthFilters).then(onlineGraphData => this.setState({ onlineGraphData }));

        if (this.user?.defaultCar) {
            api.car.getLogLatest(this.user.defaultCar.id).then(carLog => this.setState({ carLog }));
            this.setState({ car: this.user.defaultCar });
        }

        api.expense.get(lastFiveFilters).then(expenses => this.setState({ expenses: expenses.items }));

        const spentToday = await api.expense.getSum(todayFilters);
        const spentWeek = await api.expense.getSum(weekFilters);
        const spentMonth = await api.expense.getSum(monthFilters);
        this.setState({
            spent: {
                today: spentToday,
                week: spentWeek,
                month: spentMonth,
            }
        });

        const distanceToday = await api.tracking.getDistance(todayFilters);
        const distanceWeek = await api.tracking.getDistance(weekFilters);
        const distanceMonth = await api.tracking.getDistance(monthFilters);
        this.setState({
            distance: {
                today: distanceToday,
                week: distanceWeek,
                month: distanceMonth,
            }
        });
    }

    render() {
        const { carLog: carLog, consumations, distance, expenses, location, movies, onlineGraphData, spent } = this.state;

        const { defaultCurrency }: User = this.context;

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
                    {this.identity?.pif.includes(Feature.Tracking) && location &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Header>{location?.location?.name ?? location?.city?.name ?? location?.country?.name ?? 'Last location'} @ {this.dateTimeFormat(location.tracking.timestamp)}</Card.Header>
                                <Card.Body className="panel-small padding-0">
                                    {location &&
                                        <Map
                                            defaultCenter={{ lat: location.tracking.lat, lng: location.tracking.lng }}
                                            defaultZoom={15}
                                        >
                                            <Marker
                                                icon="https://cdn.anticevic.net/icons/location-small.png"
                                                position={{ lat: location.tracking.lat, lng: location.tracking.lng }}
                                                title="Current location"
                                                />
                                        </Map>
                                    }
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    {this.identity?.pif.includes(Feature.Tracking) &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Header>Distance</Card.Header>
                                <Card.Body className="panel-small padding-0">
                                    <ValueLabel round label="Today" unit="km" value={distance.today / 1000} />
                                    <ValueLabel round label="This week" unit="km" value={distance.week / 1000} />
                                    <ValueLabel round label={moment().format('MMMM')} unit="km" value={distance.month / 1000} />
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    {this.identity?.pif.includes(Feature.Finance) &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Header>Spent</Card.Header>
                                <Card.Body className="panel-small padding-0">
                                    <ValueLabel round label="Today" unit={defaultCurrency.symbol} value={spent.today} />
                                    <ValueLabel round label="This week" unit={defaultCurrency.symbol} value={spent.week} />
                                    <ValueLabel round label={moment().format('MMMM')} unit={defaultCurrency.symbol} value={spent.month} />
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    {this.identity?.pif.includes(Feature.Finance) &&
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
                    {this.identity?.pif.includes(Feature.Beer) &&
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
                    {this.identity?.pif.includes(Feature.Movies) &&
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
                    {this.identity?.pif.includes(Feature.Cars) && this.user?.defaultCar &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Img variant="top" src={`https://cdn.anticevic.net/cars/${this.user.defaultCar?.model?.id}.jpg`} />
                                <Card.Body>
                                    <Card.Title>{this.user.defaultCar?.model?.name}</Card.Title>
                                    <Card.Text>{carLog.odometer} km</Card.Text>
                                </Card.Body>
                                <Card.Body>
                                    <Card.Link href={`/car/${this.user.defaultCar.id}`}>History</Card.Link>
                                </Card.Body>
                            </Card>
                        </div>
                    }
                </div>
            </Container >
        );
    }

    dateTimeFormat = (dateTime) => {
        return moment(dateTime).date() === moment().date() ? `Today ${moment.utc(dateTime).local().format('H:mm')}` : moment.utc(dateTime).local().format('MMMM Do H:mm');
    }

    dayOfWeek = (date) => {
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
