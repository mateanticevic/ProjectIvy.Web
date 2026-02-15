import _ from 'lodash';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { Container, Badge, ListGroup, ListGroupItem, OverlayTrigger, Card, Tooltip, Button, Modal, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { Marker } from '@react-google-maps/api';
import Datetime from 'react-datetime';
import Skeleton from 'react-loading-skeleton'

import api from 'api/main';
import { Map, SimpleLineChart, ValueLabel } from 'components';
import { UserContext } from 'contexts/user-context';
import ExpenseTypeLabel from 'pages/expenses/expense-type-label';
import { getIdentity } from 'utils/cookie-helper';
import { Feature } from 'types/users';
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

const DashboardPage: React.FC = () => {
    const identity = getIdentity();
    const user = useContext(UserContext);

    const [carOdometer, setCarOdometer] = useState<number>();
    const [consumations, setConsumations] = useState<Consumation[]>();
    const [distance, setDistance] = useState<TodayWeekMonth>();
    const [expenses, setExpenses] = useState<Expense[]>();
    const [isLoading, setIsLoading] = useState(true);
    const [location, setLocation] = useState<TrackingLocation>();
    const [movies, setMovies] = useState<Movie[]>();
    const [spent, setSpent] = useState<TodayWeekMonth>();
    const [weightPerDay, setWeightPerDay] = useState<KeyValuePair<number>[]>([]);
    const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
    const [newWeightDate, setNewWeightDate] = useState(moment().format('YYYY-MM-DD'));
    const [newWeightValue, setNewWeightValue] = useState('');
    const [isSavingWeight, setIsSavingWeight] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
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

            allCalls.push(api.consumation.get(lastFiveFilters).then(consumations => setConsumations(consumations.items)));
            allCalls.push(api.movie.get(lastFiveFilters).then(movies => setMovies(movies.items)));
            allCalls.push(api.tracking.getLastLocation().then(location => setLocation(location)));
            allCalls.push(loadWeightPerDay());

            if (user?.defaultCar) {
                allCalls.push(api.car.getLogLatest(user.defaultCar.id).then(carLog => setCarOdometer(carLog.odometer)));
            }

            allCalls.push(api.expense.get(lastFiveFilters).then(expenses => setExpenses(expenses.items)));

            const spentToday = await api.expense.getSum(todayFilters);
            const spentWeek = await api.expense.getSum(weekFilters);
            const spentMonth = await api.expense.getSum(monthFilters);
            setSpent({
                today: spentToday,
                week: spentWeek,
                month: spentMonth,
            });

            const distanceToday = await api.tracking.getDistance(todayFilters);
            const distanceWeek = await api.tracking.getDistance(weekFilters);
            const distanceMonth = await api.tracking.getDistance(monthFilters);
            setDistance({
                today: distanceToday,
                week: distanceWeek,
                month: distanceMonth,
            });

            Promise.all(allCalls).then(() => setIsLoading(false));
        };

        fetchData();
    }, [user]);

    const dateTimeFormat = (dateTime: string) => moment(dateTime).date() === moment().date()
        ? `Today ${moment.utc(dateTime).local().format('H:mm')}`
        : moment.utc(dateTime).local().format('MMMM Do H:mm');

    const loadWeightPerDay = () =>
        api.user.getWeight({ From: moment().date(1).month(0).format('YYYY-MM-DD') }).then(weightPerDay => setWeightPerDay((weightPerDay ?? [])));

    const openWeightModal = () => {
        setNewWeightDate(moment().format('YYYY-MM-DD'));
        setNewWeightValue('');
        setIsWeightModalOpen(true);
    };

    const closeWeightModal = () => {
        if (!isSavingWeight) {
            setIsWeightModalOpen(false);
        }
    };

    const saveWeight = async () => {
        const weight = Number.parseFloat(newWeightValue);

        if (Number.isNaN(weight)) {
            return;
        }

        setIsSavingWeight(true);

        try {
            await api.user.postWeight({
                date: newWeightDate,
                weight,
            });
            await loadWeightPerDay();
            setIsWeightModalOpen(false);
        } finally {
            setIsSavingWeight(false);
        }
    };

    const dayOfWeek = (date: string) => {
        const fullDate = (
            <Tooltip id="tooltip">
                {moment(date).format('Do MMMM YYYY')}
            </Tooltip>
        );

        return (
            <OverlayTrigger placement="top" overlay={fullDate}>
                <Badge>
                    {moment(date).format('ddd')}
                </Badge>
            </OverlayTrigger>
        );
    };

    const renderSkeleton = () => {
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
    };

    if (isLoading) {
        return renderSkeleton();
    }

    const defaultCurrency = user?.defaultCurrency;

    return (
        <Container>
            <div className="flex-grid">
                {identity?.pif?.includes(Feature.Tracking) && location &&
                    <div className="flex-grid-item">
                        <Card>
                            <Card.Header>{location?.location?.name ?? location?.city?.name ?? location?.country?.name ?? 'Last location'} @ {dateTimeFormat(location!.tracking!.timestamp)}</Card.Header>
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
                {identity?.pif?.includes(Feature.Tracking) && distance &&
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
                {identity?.pif?.includes(Feature.Finance) && spent &&
                    <div className="flex-grid-item">
                        <Card>
                            <Card.Header>Spent</Card.Header>
                            <Card.Body className="panel-small padding-0">
                                <ValueLabel round label="Today" unit={defaultCurrency?.symbol} value={spent.today} />
                                <ValueLabel round label="This week" unit={defaultCurrency?.symbol} value={spent.week} />
                                <ValueLabel round label={moment().format('MMMM')} unit={defaultCurrency?.symbol} value={spent.month} />
                            </Card.Body>
                        </Card>
                    </div>
                }
                {identity?.pif?.includes(Feature.Finance) &&
                    <div className="flex-grid-item">
                        <Card>
                            <Card.Header><a href="/expenses">Expenses</a></Card.Header>
                            <Card.Body className="panel-small padding-0">
                                <ListGroup>
                                    {expenses?.map(expense =>
                                        <ListGroupItem key={_.uniqueId('list_item_')}>
                                            {dayOfWeek(expense.date)} <ExpenseTypeLabel type={expense.expenseType} /><span className="pull-right">{expense.amount} {expense!.currency!.symbol}</span>
                                        </ListGroupItem>
                                    )}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </div>
                }
                {identity?.pif?.includes(Feature.Beer) &&
                    <div className="flex-grid-item">
                        <Card>
                            <Card.Header><a href="/beer">Beer</a></Card.Header>
                            <Card.Body className="panel-small padding-0">
                                <ListGroup variant="flush">
                                    {consumations?.map(consumation =>
                                        <ListGroup.Item key={_.uniqueId('list_item_')}>
                                            {dayOfWeek(consumation.date)} {consumation!.beer!.name}
                                            <OverlayTrigger placement="top" overlay={<Tooltip id={_.uniqueId('tooltip_')}>{consumation.serving}</Tooltip>}>
                                                <span className="pull-right"><Badge variant="primary">{consumation.volume! / 1000}L</Badge></span>
                                            </OverlayTrigger>
                                        </ListGroup.Item>)}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </div>
                }
                {identity?.pif?.includes(Feature.Movies) &&
                    <div className="flex-grid-item">
                        <Card>
                            <Card.Header><a href="/movies">Movies</a></Card.Header>
                            <Card.Body className="panel-small padding-0">
                                <ListGroup>
                                    {movies?.map(movie =>
                                        <ListGroupItem key={_.uniqueId('list_item_')}>
                                            {dayOfWeek(movie.timestamp)} <a href={`http://www.imdb.com/title/${movie.imdbId}`} target="_blank" rel="noreferrer">{movie.title} ({movie.year})</a>
                                            <span className="pull-right"><Badge variant="primary">{movie.myRating}</Badge></span>
                                        </ListGroupItem>
                                    )}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </div>
                }
                {identity?.pif?.includes(Feature.Cars) && user?.defaultCar && carOdometer &&
                    <div className="flex-grid-item">
                        <Card>
                            <Card.Img variant="top" src={carUrl(user.defaultCar?.model?.id)} />
                            <Card.Body>
                                <Card.Title>{user.defaultCar?.model?.name}</Card.Title>
                                <Card.Text>{carOdometer} km</Card.Text>
                            </Card.Body>
                            <Card.Body>
                                <Card.Link href={`/car/${user.defaultCar.id}`}>History</Card.Link>
                            </Card.Body>
                        </Card>
                    </div>
                }
                <div className="flex-grid-item">
                    <Card>
                        <Card.Header>
                            Weight
                            <Button className="btn-sm pull-right" type="button" onClick={openWeightModal}>
                                Add
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <SimpleLineChart
                                data={[...weightPerDay].reverse()}
                                unit="kg"
                            />
                        </Card.Body>
                    </Card>
                </div>
            </div>
            <Modal show={isWeightModalOpen} onHide={closeWeightModal} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title>Add weight</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup>
                        <FormLabel>Date</FormLabel>
                        <Datetime
                            dateFormat="YYYY-MM-DD"
                            value={newWeightDate}
                            onChange={x => setNewWeightDate(moment(x).format('YYYY-MM-DD'))}
                            timeFormat={false}
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel>Weight</FormLabel>
                        <FormControl
                            type="number"
                            step="0.01"
                            value={newWeightValue}
                            onChange={x => setNewWeightValue(x.target.value)}
                        />
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={saveWeight}
                        disabled={isSavingWeight || Number.isNaN(Number.parseFloat(newWeightValue))}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container >
    );
};

export default DashboardPage;
