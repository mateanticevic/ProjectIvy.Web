import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import FontAwesome from 'react-fontawesome';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';

const ExpenseRow = (props) => {

  function onEditClick(e, expense){
    e.preventDefault();
    props.onEdit(expense);
  }

  const poiNameTooltip = (
    <Tooltip id="tooltip">
      {props.expense.poi && props.expense.poi.name}
    </Tooltip>
  );

  return (
  <tr>
      <td><Moment format="Do MMMM YYYY">{props.expense.date}</Moment></td>
      <td>{props.expense.expenseType.name}</td>
      <td>{props.expense.vendor && props.expense.vendor.name}
        &nbsp;
        {props.expense.poi &&
        <OverlayTrigger placement="right" overlay={poiNameTooltip}>
          <FontAwesome name="map-marker" />
        </OverlayTrigger>}
      </td>
      <td>{props.expense.comment}</td>
      <td><span className="pull-right">{props.expense.amount.toFixed(2)}</span></td>
      <td>{props.expense.currency.symbol}</td>
      <td><a href="#" onClick={e => onEditClick(e, props.expense)}><FontAwesome title="Edit" name="pencil-square-o" /></a></td>
  </tr>
  );
};

export default ExpenseRow;

ExpenseRow.propTypes = {
  expense: PropTypes.object
};