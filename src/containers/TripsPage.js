import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/tripsActions';
import TripsIndex from '../components/trips/TripsIndex';

export const TripsPage = (props) => {
  return (
    <TripsIndex />
  );
};

TripsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  trips: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    trips: state.trips
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TripsIndex);
