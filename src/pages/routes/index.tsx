import React, { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Container, FormGroup, FormLabel, ProgressBar, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { MdSwapVert } from 'react-icons/md';
import moment from 'moment';

import api from 'api/main';
import Spinner from 'components/spinner';
import { cityLoader, locationLoader } from 'utils/select-loaders';
import { useReactSelectStyles } from 'utils/react-select-dark-theme';

type RouteSource = 'location' | 'city';
type RouteOrder = 'date' | 'duration';

interface PlaceOption {
    value: string;
    label: string;
}

interface RouteTime {
    duration?: string | null;
    from?: string | null;
    to?: string | null;
}

interface RouteRow {
    from: string;
    to: string;
    seconds: number;
}

const TIME_SPAN = /^(-)?(?:(\d+)\.)?(\d+):(\d{1,2}):(\d{1,2})(?:\.(\d+))?$/;

const parseTimeSpanSeconds = (value?: string | null) => {
    if (!value) {
        return 0;
    }

    const match = value.match(TIME_SPAN);
    if (!match) {
        return 0;
    }

    const sign = match[1] ? -1 : 1;
    const days = Number(match[2] ?? 0);
    const hours = Number(match[3]);
    const minutes = Number(match[4]);
    const seconds = Number(match[5]);
    const fraction = match[6] ? Number(`0.${match[6]}`) : 0;

    return sign * (days * 86400 + hours * 3600 + minutes * 60 + seconds + fraction);
};

const formatDuration = (totalSeconds: number) => {
    const seconds = Math.max(0, Math.round(totalSeconds));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0) {
        return `${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
};

const toRouteRow = (item: RouteTime): RouteRow | null => {
    if (!item.from || !item.to) {
        return null;
    }

    const parsed = parseTimeSpanSeconds(item.duration);
    const seconds = parsed > 0
        ? parsed
        : Math.max(0, moment(item.to).diff(moment(item.from), 'seconds'));

    return {
        from: item.from,
        to: item.to,
        seconds,
    };
};

const RoutesPage: React.FC = () => {
    const selectStyles = useReactSelectStyles();
    const [source, setSource] = useState<RouteSource>('location');
    const [orderBy, setOrderBy] = useState<RouteOrder>('date');
    const [from, setFrom] = useState<PlaceOption | null>(null);
    const [to, setTo] = useState<PlaceOption | null>(null);
    const [routes, setRoutes] = useState<RouteRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>();

    useEffect(() => {
        if (!from?.value || !to?.value) {
            setRoutes([]);
            setError(undefined);
            setIsLoading(false);
            return;
        }

        let cancelled = false;
        setIsLoading(true);
        setError(undefined);

        const request = source === 'location'
            ? api.location.getFromTo(from.value, to.value, { orderBy })
            : api.city.getFromToRoute(from.value, to.value, { orderBy });

        request
            .then((data: RouteTime[]) => {
                if (cancelled) {
                    return;
                }

                const rows = (Array.isArray(data) ? data : [])
                    .map(toRouteRow)
                    .filter((row): row is RouteRow => row !== null);

                setRoutes(rows);
            })
            .catch(() => {
                if (cancelled) {
                    return;
                }

                setRoutes([]);
                setError('Could not load routes.');
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [source, from, to, orderBy]);

    const summary = useMemo(() => {
        if (routes.length === 0) {
            return null;
        }

        const seconds = routes.map(route => route.seconds);
        const sorted = [...seconds].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];

        return {
            count: routes.length,
            fastest: Math.min(...seconds),
            slowest: Math.max(...seconds),
            median,
            longest: Math.max(...seconds),
        };
    }, [routes]);

    const onSourceChange = (next: RouteSource) => {
        setSource(next);
        setFrom(null);
        setTo(null);
    };

    const switchEnds = () => {
        setFrom(to);
        setTo(from);
    };

    const loadOptions = source === 'location' ? locationLoader : cityLoader;

    return (
        <Container>
            <Row>
                <Col lg={4}>
                    <Card>
                        <Card.Header>Search</Card.Header>
                        <Card.Body className="routes-search">
                            <FormGroup>
                                <FormLabel>Between</FormLabel>
                                <ToggleButtonGroup
                                    name="route-source"
                                    type="radio"
                                    value={source}
                                    onChange={onSourceChange}
                                >
                                    <ToggleButton id="route-source-location" value="location">
                                        Locations
                                    </ToggleButton>
                                    <ToggleButton id="route-source-city" value="city">
                                        Cities
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>From</FormLabel>
                                <AsyncSelect
                                    key={`${source}-from`}
                                    cacheOptions
                                    defaultOptions
                                    isClearable
                                    loadOptions={loadOptions}
                                    onChange={option => setFrom(option)}
                                    placeholder={source === 'location' ? 'Search locations' : 'Search cities'}
                                    styles={selectStyles}
                                    value={from}
                                />
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>To</FormLabel>
                                <AsyncSelect
                                    key={`${source}-to`}
                                    cacheOptions
                                    defaultOptions
                                    isClearable
                                    loadOptions={loadOptions}
                                    onChange={option => setTo(option)}
                                    placeholder={source === 'location' ? 'Search locations' : 'Search cities'}
                                    styles={selectStyles}
                                    value={to}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Button
                                    aria-label="Switch from and to"
                                    className="w-100"
                                    disabled={!from && !to}
                                    variant="primary"
                                    onClick={switchEnds}
                                >
                                    <MdSwapVert /> Switch
                                </Button>
                            </FormGroup>
                            <FormGroup>
                                <FormLabel>Order by</FormLabel>
                                <ToggleButtonGroup
                                    name="route-order"
                                    type="radio"
                                    value={orderBy}
                                    onChange={(next: RouteOrder) => setOrderBy(next)}
                                >
                                    <ToggleButton id="route-order-date" value="date">
                                        Date
                                    </ToggleButton>
                                    <ToggleButton id="route-order-duration" value="duration">
                                        Duration
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </FormGroup>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={8}>
                    {!from || !to ? (
                        <Card>
                            <Card.Body>Choose a start and an end to see routes.</Card.Body>
                        </Card>
                    ) : isLoading ? (
                        <Card>
                            <Card.Body className="text-center py-4">
                                <Spinner size="2x" />
                            </Card.Body>
                        </Card>
                    ) : error ? (
                        <Card>
                            <Card.Body>{error}</Card.Body>
                        </Card>
                    ) : routes.length === 0 ? (
                        <Card>
                            <Card.Header>{from.label} → {to.label}</Card.Header>
                            <Card.Body>No routes found between these places.</Card.Body>
                        </Card>
                    ) : (
                        <>
                            <Row>
                                <Col xs={6} md={3}>
                                    <Card>
                                        <Card.Body className="text-center">
                                            <h2 className="mb-0">{summary?.count}</h2>
                                            <p className="mb-0 text-muted">Trips</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={6} md={3}>
                                    <Card>
                                        <Card.Body className="text-center">
                                            <h2 className="mb-0">{formatDuration(summary?.fastest ?? 0)}</h2>
                                            <p className="mb-0 text-muted">Fastest</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={6} md={3}>
                                    <Card>
                                        <Card.Body className="text-center">
                                            <h2 className="mb-0">{formatDuration(summary?.slowest ?? 0)}</h2>
                                            <p className="mb-0 text-muted">Slowest</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xs={6} md={3}>
                                    <Card>
                                        <Card.Body className="text-center">
                                            <h2 className="mb-0">{formatDuration(summary?.median ?? 0)}</h2>
                                            <p className="mb-0 text-muted">Median</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <Card>
                                <Card.Header>{from.label} → {to.label}</Card.Header>
                                <Card.Body>
                                    {routes.map(route => {
                                        const longest = summary?.longest ?? 0;
                                        const percent = longest > 0 ? (route.seconds / longest) * 100 : 0;

                                        return (
                                            <div key={`${route.from}-${route.to}`} className="mb-3">
                                                <div className="d-flex justify-content-between align-items-start gap-2">
                                                    <div>
                                                        <div className="fw-semibold">{moment(route.from).format('dddd, D MMMM YYYY')}</div>
                                                        <div className="text-muted">
                                                            {moment(route.from).format('HH:mm')} → {moment(route.to).format('HH:mm')}
                                                        </div>
                                                    </div>
                                                    <Badge bg="secondary">{formatDuration(route.seconds)}</Badge>
                                                </div>
                                                <ProgressBar className="mt-2" now={percent} />
                                            </div>
                                        );
                                    })}
                                </Card.Body>
                            </Card>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default RoutesPage;
