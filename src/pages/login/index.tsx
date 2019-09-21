import React from 'react';
import { Row, Col, ControlLabel, FormControl, Panel } from 'react-bootstrap/lib';
import { boundMethod } from 'autobind-decorator';

import * as tokenApi from '../../api/main/token';
import * as apiConfig from '../../api/config';
import ButtonWithSpinner from '../../components/common/ButtonWithSpinner';

type State = {
  isLoggingIn: boolean,
  username: string,
  password: string
}

class LoginPage extends React.Component<{}, State> {

  state: State = {
    isLoggingIn: false,
    username: '',
    password: ''
  }

  @boundMethod
  loginTry(event) {
    event.preventDefault();
    this.setState({
      isLoggingIn: true
    });
    tokenApi.post(this.state.username, this.state.password).then(token => {
      localStorage.setItem("token", token);
      apiConfig.setToken();
      location.assign('/');
    }).catch(() => {
      this.setState({
        isLoggingIn: false
      });
    });
  }

  render() {

    return (
      <Panel className="panel-login">
        <Panel.Heading>Login</Panel.Heading>
        <Panel.Body>
          <form onSubmit={this.loginTry}>
            <Row>
              <Col sm={12}>
                <ControlLabel>Username</ControlLabel>
                <FormControl type="text" onChange={e => this.setState({ username: e.target.value })} />
              </Col>
              <Col sm={12}>
                <ControlLabel>Password</ControlLabel>
                <FormControl type="password" onChange={e => this.setState({ password: e.target.value })} />
              </Col>
            </Row>
            <Row className="margin-top-10">
              <Col xs={12}><ButtonWithSpinner onClick={this.loginTry} isLoading={this.state.isLoggingIn}>Login</ButtonWithSpinner></Col>
            </Row>
          </form>
        </Panel.Body>
      </Panel>
    );
  }
}

export default LoginPage;
