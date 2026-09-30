import moment from 'moment';
import React from 'react';
import { Container, Card, Col, Row, Table, Badge, InputGroup, FormControl, Button, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import api from 'api/main';
import { Car, CarModel, CarServiceInterval } from 'types/car';
import { DistributionCard, SimpleScatterChart, ValueLabel } from 'components';
import { ServiceModal } from './service-modal';
import { KeyValuePair } from 'types/grouping';

interface QueryStrings {
    id: string;
}

interface Props {
    params: QueryStrings;
}

interface State {
    averageConsumption?: number;
    car: Car;
    fuelSumByYear?: KeyValuePair<number>[];
    kilometersByYear?: KeyValuePair<number>[];
    logs: any;
    isLogSubmitting: boolean;
    isServiceModalOpen: boolean;
    logOdometer: string;
    service: any;
    serviceTypes: any;
    serviceIntervals: CarServiceInterval[];
}

class CarDetailsPage extends React.Component<Props, State> {
    logSubmitInFlight = false;

    state: State = {
        car: {
            id: '',
            model: {} as CarModel,
            services: [],
            serviceDue: [],
        },
        logs: [],
        isLogSubmitting: false,
        isServiceModalOpen: false,
        logOdometer: '',
        service: {

        },
        serviceTypes: [],
        serviceIntervals: []
    };

    async componentDidMount() {
        await this.reload(this.props.params.id);
    }

    render() {
        const { car, logs } = this.state;

        return (
            <Container>
                <Row>
                    <Col>
                        <h1>{car.model.name}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col lg={5}>
                        <Card>
                            <Card.Header>Odometer</Card.Header>
                            <Card.Body>
                                <SimpleScatterChart
                                    data={logs.map(x => {
                                        return {
                                            ...x,
                                            timestamp: new Date(x.timestamp).getTime(),
                                        };
                                    })}
                                    unit='km'
                                />
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header>Log</Card.Header>
                            <Card.Body>
                                <Form onSubmit={this.onLogSubmit}>
                                    <InputGroup>
                                        <FormControl
                                            type="number"
                                            value={this.state.logOdometer}
                                            onChange={e => this.setState({ logOdometer: e.target.value })}
                                        />
                                        <InputGroup.Text>km</InputGroup.Text>
                                        <Button
                                            type="submit"
                                            disabled={!this.state.logOdometer || this.state.isLogSubmitting}
                                        >
                                            Add
                                        </Button>
                                    </InputGroup>
                                </Form>
                            </Card.Body>
                        </Card>
                        {this.state.kilometersByYear &&
                            <DistributionCard
                                data={this.state.kilometersByYear!}
                                name="Kilometers by year"
                                unit="km"
                            />
                        }
                        {this.state.fuelSumByYear &&
                            <DistributionCard
                                data={this.state.fuelSumByYear!}
                                name="Fueling by year"
                                unit="L"
                            />
                        }
                    </Col>
                    <Col lg={4}>
                        <Card>
                            <Card.Header>
                                <Row>
                                    <Col xs={10}>
                                        Service history
                                    </Col>
                                    <Col xs={2}>
                                        <Button
                                            size="sm"
                                            onClick={() => this.setState({ isServiceModalOpen: true })}
                                        >New</Button>
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body>
                                <Table>
                                    <tbody>
                                        {car.services.map(service =>
                                            <tr title={service.description}>
                                                <td>{moment(service.date).format('D MMMM YYYY')}</td>
                                                <td>
                                                    <Badge variant="primary">{service.serviceType.name}</Badge>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={3}>
                        <Card>
                            <Card.Header>Service due</Card.Header>
                            <Card.Body>
                                <Table>
                                    <tbody>
                                        {car.serviceDue.map(serviceDue =>
                                            <tr>
                                                <td>
                                                    {serviceDue.dueBefore &&
                                                        `${moment(serviceDue.dueBefore).diff(moment(), 'days')} days`
                                                    }
                                                    {serviceDue.dueIn &&
                                                        `${serviceDue.dueIn}km (~${moment(serviceDue.dueBeforeApprox).diff(moment(), 'days')} days)`
                                                    }
                                                </td>
                                                <td>
                                                    <Badge variant="primary">{serviceDue.serviceType.name}</Badge>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                        {this.state.averageConsumption &&
                            <Card>
                                <Card.Header>Average consumption</Card.Header>
                                <Card.Body className="panel-small padding-0">
                                    <ValueLabel label="Total" unit="l/km" value={this.state.averageConsumption} />
                                </Card.Body>
                            </Card>
                        }
                    </Col>
                </Row>
                <ServiceModal
                    isOpen={this.state.isServiceModalOpen}
                    service={this.state.service}
                    types={this.state.serviceTypes}
                    onChange={this.onServiceChange}
                    onClose={() => this.setState({ isServiceModalOpen: false })}
                    onSave={this.saveService}
                />
            </Container>
        );
    }

    onLogSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        this.createLog();
    };

    createLog = async () => {
        const odometer = Number(this.state.logOdometer);
        if (!this.state.logOdometer || Number.isNaN(odometer) || this.logSubmitInFlight) {
            return;
        }

        this.logSubmitInFlight = true;
        this.setState({ isLogSubmitting: true });
        try {
            await api.car.postLog(this.state.car.id, { odometer });
            this.setState({ logOdometer: '' });
            await this.reload();
        } finally {
            this.logSubmitInFlight = false;
            this.setState({ isLogSubmitting: false });
        }
    };

    onServiceChange = (changed) => {
        this.setState({
            service: {
                ...this.state.service,
                ...changed,
            }
        });
    };

    reload = async (carId?: string) => {
        const id = carId ?? this.state.car.id;
        const car = await api.car.get(id);
        const logs = await api.car.getLogs(id, { hasOdometer: true });

        if (carId) {
            const serviceTypes = await api.car.getServiceTypes(car.model.id);
            this.setState({ serviceTypes });
            api.car.getFuelSumByYear(carId).then(fuelSumByYear => this.setState({ fuelSumByYear }));
        }

        api.car.getKilometersByYear(id).then(kilometersByYear => this.setState({ kilometersByYear }));

        this.setState({
            car,
            logs,
            serviceIntervals: await api.car.getServiceIntervals(car.model.id)
        });

        const averageConsumption = await api.car.getAverageConsumption(id);
        this.setState({ averageConsumption });
    };

    saveService = async () => {
        await api.car.postService(this.state.car.id, this.state.service);
        this.setState({ isServiceModalOpen: false });
        this.reload();
    };
}

export default () =>
    <CarDetailsPage params={useParams() as QueryStrings} />;