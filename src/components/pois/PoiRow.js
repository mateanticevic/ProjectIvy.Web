import React from 'react';
import PropTypes from 'prop-types';

const PoiRow = (props) => {

  return (
  <tr>
      <td>{props.poi.name}</td>
      <td>{props.poi.category.name}</td>
  </tr>
  );
};

export default PoiRow;

PoiRow.propTypes = {
  poi: PropTypes.object
};