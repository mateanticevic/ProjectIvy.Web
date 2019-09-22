import React from 'react';
import FontAwesome from 'react-fontawesome';

const Spinner = ({ size }) => <FontAwesome name="circle-o-notch" size={size} spin={true} />;

export default Spinner;
