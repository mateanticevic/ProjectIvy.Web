import React from 'react';
import moment from 'moment';
import { Card, Container, Dropdown, DropdownButton, Table } from 'react-bootstrap';
import { UserSession } from 'types/users';

import { Page } from '../Page';
import api from '../../api/main';
import { FlagIcon } from '../../components';

interface State {
    sessions?: UserSession[];
}

class AccountPage extends Page<{}, State> {
    state: State = {
    }

    componentDidMount() {
        this.reloadSessions();
    }

    render() {
        const { sessions } = this.state;

        return (
            <Container>
                <Card>
                    <Card.Header>Sessions</Card.Header>
                    <Card.Body>
                        <Table responsive>
                            <tbody>
                                {sessions?.map(session =>
                                    <tr className={session.isCurrentSession ? 'alert-success' : ''}>
                                        <td>
                                            {session.country &&
                                                <FlagIcon
                                                    country={session.country.name}
                                                    code={session.country.id}
                                                    title={session.country.name}
                                                />
                                            }
                                        </td>
                                        <td>{session.ipAddress}</td>
                                        <td>{moment(session.validUntil).toString()}</td>
                                        <td>{session.userAgent}</td>
                                        <td>{session.operatingSystem}</td>
                                        <td>
                                            {!session.isCurrentSession &&
                                                <DropdownButton
                                                    title="Actions"
                                                    variant="primary"
                                                    size="sm"
                                                >
                                                    <Dropdown.Item onClick={() => this.closeSession(session.id)}>Close</Dropdown.Item>
                                                </DropdownButton>
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    closeSession = (sessionId: string) => {
        api.user
            .deleteSession(sessionId)
            .then(this.reloadSessions);
    }

    reloadSessions = () => {
        api.user
            .getSessions()
            .then(sessions => this.setState({ sessions }));
    }
}

export default AccountPage;