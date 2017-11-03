import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import FontAwesome from 'react-fontawesome';
import { OverlayTrigger, Tooltip, Button, Label } from 'react-bootstrap/lib';

const ExpenseRow = (props) => {

  const poiNameTooltip = (
    <Tooltip id="tooltip">
      {props.expense.poi && props.expense.poi.name}
    </Tooltip>
  );

  return (
  <tr>
      <td><Moment format="Do MMMM YYYY">{props.expense.date}</Moment></td>
      <td>
        <Label bsStyle="primary"><FontAwesome name={props.expense.expenseType.icon} /> {props.expense.expenseType.name}</Label>
      </td>
      <td>{props.expense.vendor && props.expense.vendor.name}
        &nbsp;
        {props.expense.poi &&
        <OverlayTrigger placement="right" overlay={poiNameTooltip}>
          <FontAwesome name="map-marker" />
        </OverlayTrigger>}
      </td>
      <td className="cell-no-overflow-100" title={props.expense.comment}>{props.expense.comment}</td>
      <td><span className="pull-right">{props.expense.amount.toFixed(2)}</span></td>
      <td>{props.expense.currency.symbol}</td>
      <td>
      {props.onEdit &&
        <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={() => props.onEdit(props.expense)}><FontAwesome name="pencil" /> Edit</Button>      
      }
      {props.onUnlink &&
        <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={() => props.onUnlink(props.expense.id)}><FontAwesome name="link" /> Unlink</Button>      
      }
      </td>
  </tr>
  );
};

export default ExpenseRow;

ExpenseRow.propTypes = {
  expense: PropTypes.object
};