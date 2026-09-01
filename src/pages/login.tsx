import React from 'react';
import { Button, Card, FloatingLabel, Form } from 'react-bootstrap';
import { FaGithub, FaMicrosoft } from 'react-icons/fa';

import ButtonWithSpinner from 'components/button-with-spinner';

interface State {
    loggingIn?: boolean;
    password?: string;
    username?: string;
}

const loginWithOAuthProviderUrl = `${import.meta.env.VITE_AUTH_URL}/realms/ivy/protocol/openid-connect/auth?client_id=web&redirect_uri=${import.meta.env.VITE_APP_URL}&response_type=code&scope=openid`;

export default class LoginPage extends React.Component<{}, State> {
    public state: State = {};

    login = () => {
        this.setState({
            loggingIn: true,
        });

        const payload = { username: this.state.username, password: this.state.password, grant_type: 'password', scope: 'email' };

        var formBody: string[] = [];
        for (var property in payload) {
            const encodedKey = encodeURIComponent(property);
            const encodedValue = encodeURIComponent(payload[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }

        fetch(`${import.meta.env.VITE_AUTH_URL}/realms/ivy/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
                Authorization: 'Basic d2ViOg==',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody.join("&")
        })
            .then(response => {
                if (response.status === 200) {
                    response.json().then(data => {
                        document.cookie = `AccessToken=${data.access_token};domain=${import.meta.env.VITE_ACCESS_TOKEN_COOKIE_DOMAIN};`;
                        location.reload();
                    });
                }
                else {
                    this.setState({
                        loggingIn: false,
                    });
                }
            })
            .catch(() => {
                this.setState({
                    loggingIn: false,
                });
            });
    }

    public render() {
        return (
            <div className="login-form">
                <Card>
                    <Card.Body>
                        <Form>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="User"
                                className="mb-3"
                            >
                                <Form.Control type="text" onChange={x => this.setState({ username: x.target.value })} />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Password"
                                className="mb-3"
                            >
                                <Form.Control type="password" onChange={x => this.setState({ password: x.target.value })} />
                            </FloatingLabel>
                            <div className="form-grid">
                                <ButtonWithSpinner
                                    isLoading={!!this.state.loggingIn}
                                    onClick={this.login}
                                >Log in</ButtonWithSpinner>
                                <Button
                                    variant="primary"
                                    href={`${loginWithOAuthProviderUrl}&kc_idp_hint=microsoft`}
                                >
                                    <FaMicrosoft /> Log in with Microsoft
                                </Button>
                                <Button
                                    variant="primary"
                                    href={`${loginWithOAuthProviderUrl}&kc_idp_hint=github`}
                                >
                                    <FaGithub /> Log in with GitHub
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}
