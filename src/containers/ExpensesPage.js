import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as actions from '../actions/expensesActions';
import ExpensesIndex from '../components/expenses/ExpensesIndex';

export const ExpensesPage = () => {
  return (
    <ExpensesIndex />
  );
};

ExpensesPage.propTypes = {
  actions: PropTypes.object.isRequired,
  expenses: PropTypes.object.isRequired,
  registers: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  console.log(state);
  return {
    expenses: state.expenses,
    registers: state.registers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesIndex);
