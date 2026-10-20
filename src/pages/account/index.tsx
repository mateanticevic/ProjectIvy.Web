import React, { useContext } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { RiAccountCircleLine } from 'react-icons/ri';
import moment from 'moment';

import { UserContext } from 'contexts/user-context';

const displayValue = (value?: string | null) => value?.trim() || 'Not provided';

export default function AccountPage() {
    const user = useContext(UserContext);
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    const currency = user.defaultCurrency;
    const currencyName = currency?.name && currency?.code
        ? `${currency.name} (${currency.code})`
        : currency?.name || currency?.code || currency?.symbol;
    const trackingDate = user.trackingStartDate ? moment(user.trackingStartDate) : undefined;

    return (
        <Container>
            <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-primary text-white rounded-circle p-3 d-flex align-items-center justify-content-center flex-shrink-0">
                    <RiAccountCircleLine size={32} aria-hidden="true" />
                </div>
                <div style={{ minWidth: 0 }}>
                    <h1 className="fs-3 mb-1">My Account</h1>
                    <p className="text-body-secondary text-break mb-0">{fullName || 'Your profile'}</p>
                </div>
            </div>
            <Row>
                <Col lg={6}>
                    <Card>
                        <Card.Header as="h2" className="fs-5">Profile</Card.Header>
                        <Card.Body>
                            <dl className="mb-0 text-break">
                                <dt className="text-body-secondary fw-normal">First name</dt>
                                <dd className="mb-3">{displayValue(user.firstName)}</dd>
                                <dt className="text-body-secondary fw-normal">Last name</dt>
                                <dd className="mb-3">{displayValue(user.lastName)}</dd>
                                <dt className="text-body-secondary fw-normal">Username</dt>
                                <dd className="mb-3">{displayValue(user.username)}</dd>
                                <dt className="text-body-secondary fw-normal">Email</dt>
                                <dd className="mb-0">{displayValue(user.email)}</dd>
                            </dl>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card>
                        <Card.Header as="h2" className="fs-5">Preferences</Card.Header>
                        <Card.Body>
                            <dl className="mb-0 text-break">
                                <dt className="text-body-secondary fw-normal">Default currency</dt>
                                <dd className="mb-3">{currencyName || 'Not set'}</dd>
                                <dt className="text-body-secondary fw-normal">Default car</dt>
                                <dd className="mb-3">{user.defaultCar?.model?.name || 'Not set'}</dd>
                                <dt className="text-body-secondary fw-normal">Tracking since</dt>
                                <dd className="mb-0">{trackingDate?.isValid() ? trackingDate.format('LL') : 'Not set'}</dd>
                            </dl>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
