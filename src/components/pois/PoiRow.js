import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Button } from 'react-bootstrap/lib';

const PoiRow = (props) => {

  return (
  <tr>
    <td>{props.poi.name}</td>
    <td>{props.poi.category.name}</td>
    <td>{props.poi.address}</td>
    <td>
      <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={() => props.onEdit(props.expense)}>
        <FontAwesome name="map" /> Show
      </Button>
    </td>
  </tr>
  );
};

export default PoiRow;

PoiRow.propTypes = {
  poi: PropTypes.object
};