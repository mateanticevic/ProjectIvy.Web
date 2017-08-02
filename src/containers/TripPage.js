import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/tripsActions';
import TripIndex from '../components/trips/TripIndex';

export const TripPage = () => {
  return (
    <TripIndex />
  );
};

TripPage.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(TripIndex);
