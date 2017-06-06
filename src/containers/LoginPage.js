import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/loginActions';
import LoginIndex from '../components/login/LoginIndex';

export const LoginPage = (props) => {
  return (
    <LoginIndex />
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(LoginIndex);
