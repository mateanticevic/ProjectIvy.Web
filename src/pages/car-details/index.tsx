import moment from 'moment';
import React from 'react';
import { Container, Card, Col, Row, Table, Badge } from 'react-bootstrap';

import api from '../../api/main';
import { Car, CarModel, CarServiceInterval } from 'types/car';
import { SimpleScatterChart } from '../../components';

interface State {
    car: Car;
    logs: any;
    serviceIntervals: CarServiceInterval[];
}

class CarDetailsPage extends React.Component<{}, State> {
    state: State = {
        car: {
            model: {} as CarModel,
            services: [],
            serviceDue: [],
        },
        logs: [],
        serviceIntervals: []
    };

    async componentDidMount() {
        const carId = this.props.match.params.id;

        const car = await api.car.get(carId);
        const logs = await api.car.getLogs(carId, { hasOdometer: true });

        this.setState({
            car,
            logs,
            serviceIntervals: await api.car.getServiceIntervals(car.model.id)
        });
    }

    render() {
        const { car, logs, serviceIntervals } = this.state;

        return (
            <Container>
                <Row>
                    <h1>{car.model.name}</h1>
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
                    </Col>
                    <Col lg={4}>
                        <Card>
                            <Card.Header>Service history</Card.Header>
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
                                                        `${serviceDue.dueIn}km`
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
            </Container>
        );
    }
}

export default CarDetailsPage;
