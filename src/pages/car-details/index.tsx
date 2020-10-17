import moment from 'moment';
import React from 'react';
import { Container, Card, Row, Table, Badge } from 'react-bootstrap';

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
                    <Card style={{ width: '800px' }}>
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
                        <Card.Header>Service history</Card.Header>
                        <Card.Body>
                            <Table>
                                <tbody>
                                    {car.services.map(service =>
                                        <tr>
                                            <td>{moment(service.date).format('D MMMM YYYY')}</td>
                                            <td>
                                                <Badge variant="primary">{service.serviceType.name}</Badge>
                                            </td>
                                            <td>{service.description}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>Service intervals</Card.Header>
                        <Card.Body>
                            <Table>
                                <tbody>
                                    {car.serviceDue.map(serviceDue =>
                                        <tr>
                                            <td>
                                                <Badge variant="primary">{serviceDue.serviceType.name}</Badge>
                                            </td>
                                            <td>
                                                {serviceDue.dueBefore}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
        );
    }
}

export default CarDetailsPage;
