import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Well from 'react-bootstrap/lib/Well';
import WidgetCard from './WidgetCard';

const Widget = (props) => {

  return (
      <Well style={{ margin: 0, height: 85 }}>
          {props.value &&
            <WidgetCard unit={props.unit} title={props.title} value={props.value} />
          }
          {props.value == undefined &&
            <FontAwesome name="circle-o-notch" size="2x" spin={true} />
          }
      </Well>
  );
};

Widget.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.any
};

export default Widget;
