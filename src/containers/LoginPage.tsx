import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Row, Col, ControlLabel, FormControl, Panel } from 'react-bootstrap/lib';

import * as actions from '../actions/loginActions';

class LoginPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.onCredentialsChanged = this.onCredentialsChanged.bind(this);
    this.loginTry = this.loginTry.bind(this);
  }

  onCredentialsChanged(credentialValue) {
    let credentials = { ...this.props.login.credentials, ...credentialValue };
    this.props.actions.changedCredentials(credentials);
  }

  loginTry(event) {
    event.preventDefault();
    this.props.actions.loginTry(this.props.login.credentials);
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
                <FormControl type="text" onChange={e => this.onCredentialsChanged({ username: e.target.value })} />
              </Col>
              <Col sm={12}>
                <ControlLabel>Password</ControlLabel>
                <FormControl type="password" onChange={e => this.onCredentialsChanged({ password: e.target.value })} />
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

function mapStateToProps(state) {
  return {
    login: state.login
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
