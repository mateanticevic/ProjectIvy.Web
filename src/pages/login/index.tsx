import React from 'react';
import { Button, Row, Col, ControlLabel, FormControl, Panel } from 'react-bootstrap/lib';
import { boundMethod } from 'autobind-decorator';

import * as tokenApi from '../../api/main/token';
import * as apiConfig from '../../api/config';

type Status = {
  username: string,
  password: string
}

class LoginPage extends React.Component<{}, Status> {

  state = {
    username: '',
    password: ''
  }

  @boundMethod
  loginTry(event) {
    event.preventDefault();
    tokenApi.post(this.state.username, this.state.password).then(token => {
      localStorage.setItem("token", token);
      apiConfig.setToken();
      location.assign('/');
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
              <Col xs={12}><Button block type="submit" bsStyle="primary" onClick={this.loginTry}>Login</Button></Col>
            </Row>
          </form>
        </Panel.Body>
      </Panel>
    );
  }
}

export default LoginPage;
