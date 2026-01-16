import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Container, Badge, ListGroup, ListGroupItem, OverlayTrigger, Card, Tooltip, Row } from 'react-bootstrap';
import { Marker } from '@react-google-maps/api';
import Skeleton from 'react-loading-skeleton'

import api from 'api/main';
import { Map, SimpleLineChart, ValueLabel } from 'components';
import { UserContext } from 'contexts/user-context';
import ExpenseTypeLabel from 'pages/expenses/expense-type-label';
import { getIdentity } from 'utils/cookie-helper';
import { Feature, User } from 'types/users';
import { components } from 'types/ivy-types';
import { KeyValuePair } from 'types/grouping';
import { carUrl } from 'utils/cdn-helper';

type Consumation = components['schemas']['Consumation'];
type Expense = components['schemas']['Expense'];
type Movie = components['schemas']['Movie'];
type TrackingLocation = components['schemas']['TrackingLocation'];

interface TodayWeekMonth {
    month: number,
    today: number,
    week: number,
}

interface State {
    carOdometer?: number,
    consumations?: Consumation[],
    distance?: TodayWeekMonth,
    expenses?: Expense[],
    isLoading: boolean,
    location?: TrackingLocation,
    movies?: Movie[],
    spent?: TodayWeekMonth,
    weightPerDay: KeyValuePair<number>[],
}

class DashboardPage extends React.Component<unknown, State> {
    identity = getIdentity();
    user: User;

    state: State = {
        isLoading: true,
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

        const allCalls: Promise<any>[] = [];

        allCalls.push(api.consumation.get(lastFiveFilters).then(consumations => this.setState({ consumations: consumations.items })));
        allCalls.push(api.movie.get(lastFiveFilters).then(movies => this.setState({ movies: movies.items })));
        allCalls.push(api.tracking.getLastLocation().then(location => this.setState({ location })));
        allCalls.push(api.user.getWeight({ From: moment().date(1).month(0).format('YYYY-MM-DD') }).then(weightPerDay => this.setState({ weightPerDay })));

        if (this.user?.defaultCar) {
            allCalls.push(api.car.getLogLatest(this.user.defaultCar.id).then(carLog => this.setState({ carOdometer: carLog.odometer })));
            this.setState({ car: this.user.defaultCar });
        }

        allCalls.push(api.expense.get(lastFiveFilters).then(expenses => this.setState({ expenses: expenses.items })));

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

        Promise.all(allCalls).then(() => this.setState({ isLoading: false }));
    }

    render() {
        const { carOdometer, consumations, distance, expenses, isLoading, location, movies, spent } = this.state;

        const { defaultCurrency }: User = this.context;

        if (isLoading) {
            return this.renderSkeleton();
        }

        return (
            <Container>
                <div className="flex-grid">
                    {this.identity?.pif?.includes(Feature.Tracking) && location &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Header>{location?.location?.name ?? location?.city?.name ?? location?.country?.name ?? 'Last location'} @ {this.dateTimeFormat(location!.tracking!.timestamp)}</Card.Header>
                                <Card.Body className="panel-small padding-0">
                                    {location &&
                                        <Map
                                            defaultCenter={{ lat: location!.tracking!.lat, lng: location!.tracking!.lng }}
                                            defaultZoom={15}
                                        >
                                            <Marker
                                                icon={`${import.meta.env.VITE_CDN_URL}/icons/location-small.png`}
                                                position={{ lat: location.tracking.lat, lng: location.tracking.lng }}
                                                title="Current location"
                                            />
                                        </Map>
                                    }
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    {this.identity?.pif?.includes(Feature.Tracking) && distance &&
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
                    {this.identity?.pif?.includes(Feature.Finance) && spent &&
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
                    {this.identity?.pif?.includes(Feature.Finance) &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Header><a href="/expenses">Expenses</a></Card.Header>
                                <Card.Body className="panel-small padding-0">
                                    <ListGroup>
                                        {expenses?.map(expense =>
                                            <ListGroupItem key={_.uniqueId('list_item_')}>
                                                {this.dayOfWeek(expense.date)} <ExpenseTypeLabel type={expense.expenseType} /><span className="pull-right">{expense.amount} {expense!.currency!.symbol}</span>
                                            </ListGroupItem>
                                        )}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    {this.identity?.pif?.includes(Feature.Beer) &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Header><a href="/beer">Beer</a></Card.Header>
                                <Card.Body className="panel-small padding-0">
                                    <ListGroup variant="flush">
                                        {consumations?.map(consumation =>
                                            <ListGroup.Item key={_.uniqueId('list_item_')}>
                                                {this.dayOfWeek(consumation.date)} {consumation!.beer!.name}
                                                <OverlayTrigger placement="top" overlay={<Tooltip id={_.uniqueId('tooltip_')}>{consumation.serving}</Tooltip>}>
                                                    <span className="pull-right"><Badge variant="primary">{consumation.volume! / 1000}L</Badge></span>
                                                </OverlayTrigger>
                                            </ListGroup.Item>)}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    {this.identity?.pif?.includes(Feature.Movies) &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Header><a href="/movies">Movies</a></Card.Header>
                                <Card.Body className="panel-small padding-0">
                                    <ListGroup>
                                        {movies?.map(movie =>
                                            <ListGroupItem key={_.uniqueId('list_item_')}>
                                                {this.dayOfWeek(movie.timestamp)} <a href={`http://www.imdb.com/title/${movie.imdbId}`} target="_blank" rel="noreferrer">{movie.title} ({movie.year})</a>
                                                <span className="pull-right"><Badge variant="primary">{movie.myRating}</Badge></span>
                                            </ListGroupItem>
                                        )}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    {this.identity?.pif?.includes(Feature.Cars) && this.user?.defaultCar && carOdometer &&
                        <div className="flex-grid-item">
                            <Card>
                                <Card.Img variant="top" src={carUrl(this.user.defaultCar?.model?.id)} />
                                <Card.Body>
                                    <Card.Title>{this.user.defaultCar?.model?.name}</Card.Title>
                                    <Card.Text>{carOdometer} km</Card.Text>
                                </Card.Body>
                                <Card.Body>
                                    <Card.Link href={`/car/${this.user.defaultCar.id}`}>History</Card.Link>
                                </Card.Body>
                            </Card>
                        </div>
                    }
                    <div className="flex-grid-item">
                        <Card>
                            <Card.Header>Weight</Card.Header>
                            <Card.Body>
                                <SimpleLineChart
                                    data={this.state.weightPerDay.reverse()}
                                    unit="kg"
                                />
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </Container >
        );
    }

    dateTimeFormat = (dateTime) => moment(dateTime).date() === moment().date()
        ? `Today ${moment.utc(dateTime).local().format('H:mm')}`
        : moment.utc(dateTime).local().format('MMMM Do H:mm');

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
    };

    renderSkeleton = () => {
        return (
            <Container>
                <div className="flex-grid">
                    <div className="flex-grid-item">
                        <Skeleton width={430} height={272} />
                    </div>
                    <div className="flex-grid-item">
                        <Skeleton width={430} height={272} />
                    </div>
                    <div className="flex-grid-item">
                        <Skeleton width={430} height={272} />
                    </div>
                    <div className="flex-grid-item">
                        <Skeleton width={430} height={272} />
                    </div>
                    <div className="flex-grid-item">
                        <Skeleton width={430} height={272} />
                    </div>
                    <div className="flex-grid-item">
                        <Skeleton width={430} height={272} />
                    </div>
                    <div className="flex-grid-item">
                        <Skeleton width={430} height={272} />
                    </div>
                </div>
            </Container>
        );
    }
}

DashboardPage.contextType = UserContext;

export default DashboardPage;
