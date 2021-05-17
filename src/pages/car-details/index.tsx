import moment from 'moment';
import React from 'react';
import { Container, Card, Col, Row, Table, Badge, InputGroup, FormControl, Button } from 'react-bootstrap';

import api from 'api/main';
import { Car, CarModel, CarServiceInterval } from 'types/car';
import { SimpleScatterChart } from 'components';
import { ServiceModal } from './ServiceModal';

interface State {
    car: Car;
    logs: any;
    isServiceModalOpen: boolean;
    service: any;
    serviceTypes: any;
    serviceIntervals: CarServiceInterval[];
}

class CarDetailsPage extends React.Component<{}, State> {
    state: State = {
        car: {
            id: '',
            model: {} as CarModel,
            services: [],
            serviceDue: [],
        },
        logs: [],
        isServiceModalOpen: false,
        service: {

        },
        serviceTypes: [],
        serviceIntervals: []
    };

    async componentDidMount() {
        await this.reload(this.props.match.params.id);
    }

    render() {
        const { car, logs, serviceIntervals } = this.state;

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
                                <InputGroup>
                                    <FormControl
                                        type="number"
                                        onKeyUp={e => e.key === 'Enter' && this.createLog(e.target.value)}
                                    />
                                    <InputGroup.Append>
                                        <InputGroup.Text>km</InputGroup.Text>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Card.Body>
                        </Card>
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

    createLog = async (odometer: number) => {
        await api.car.postLog(this.state.car.id, {
            odometer
        });
        this.reload();
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
        const car = await api.car.get(carId ?? this.state.car.id);
        const logs = await api.car.getLogs(carId ?? this.state.car.id, { hasOdometer: true });

        if (carId) {
            const serviceTypes = await api.car.getServiceTypes(car.model.id);
            this.setState({ serviceTypes });
        }

        this.setState({
            car,
            logs,
            serviceIntervals: await api.car.getServiceIntervals(car.model.id)
        });
    };

    saveService = async () => {
        await api.car.postService(this.state.car.id, this.state.service);
        this.setState({ isServiceModalOpen: false });
        this.reload();
    };
}

export default CarDetailsPage;
