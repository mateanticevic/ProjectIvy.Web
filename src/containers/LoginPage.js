import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/loginActions';
import Button from 'react-bootstrap/lib/Button';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import objectAssign from 'object-assign';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';

class LoginPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.onCredentialsChanged = this.onCredentialsChanged.bind(this);
    this.loginTry = this.loginTry.bind(this);
  }

  onCredentialsChanged(credentialValue){
    let credentials = objectAssign({}, this.props.login.credentials, credentialValue);
    this.props.actions.changedCredentials(credentials);
  }

  loginTry(event){
      event.preventDefault();
      this.props.actions.loginTry(this.props.login.credentials);
  }

  render() {

    return (
      <Grid>
          <Row>
              <Col lg={4} lgOffset={4}>
                <Panel header="Login">
                    <form onSubmit={this.loginTry}>
                        <Row>
                            <Col lg={12}>
                                <ControlLabel>Username</ControlLabel>
                                <FormControl type="text" onChange={e => this.onCredentialsChanged({username: e.target.value})}/>
                            </Col>
                            <Col lg={12}>
                                <ControlLabel>Password</ControlLabel>
                                <FormControl type="password" onChange={e => this.onCredentialsChanged({password: e.target.value})}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6}><Button type="submit" onClick={this.loginTry}>Login</Button></Col>
                        </Row>
                    </form>
                </Panel>
              </Col>
          </Row>
      </Grid>
    );
  }
}

LoginPage.propTypes = {
  actions: PropTypes.object.isRequired,
  login: PropTypes.object.isRequired
};

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
