import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Well from 'react-bootstrap/lib/Well';
import WidgetCard from './WidgetCard';
import * as formatHelper from '../../utils/formatHelper';

const Widget = (props) => {

  return (
      <Well>
          {props.value &&
            <WidgetCard unit={props.unit} title={props.title} value={props.value} />
          }
          {!props.value &&
            <FontAwesome name='circle-o-notch' size="2x" spin={true} />
          }
      </Well>
  );
};

Widget.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

export default Widget;
