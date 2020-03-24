import moment from 'moment';
import React from 'react';
import { Col, Container, Card, Row, Table, Badge } from 'react-bootstrap';

import api from '../../api/main';
import { Car, CarModel, CarServiceInterval } from 'types/car';

interface State {
    car: Car
    serviceIntervals: CarServiceInterval[]
}

class CarDetailsPage extends React.Component<{}, State> {

    state: State = {
        car: {
            model: {} as CarModel,
            services: []
        },
        serviceIntervals: []
    };

    async componentDidMount() {
        const car = await api.car.get(this.props.match.params.id);

        this.setState({
            car,
            serviceIntervals: await api.car.getServiceIntervals(car.model.id)
        });
    }

    render() {

        const { car, serviceIntervals } = this.state;

        return (
            <Container>
                <Row>
                    <h1>{car.model.name}</h1>
                </Row>
                <Row>
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
                                    {serviceIntervals.map(serviceInterval =>
                                        <tr>
                                            <td>
                                                <Badge variant="primary">{serviceInterval.serviceType.name}</Badge>
                                            </td>
                                            <td>
                                                {serviceInterval.range &&
                                                    `${serviceInterval.range}km`
                                                }
                                                {serviceInterval.days &&
                                                    `${Math.floor(serviceInterval.days/365)} years`
                                                }
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
