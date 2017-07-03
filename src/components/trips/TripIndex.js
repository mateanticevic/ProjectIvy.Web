import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Carousel from 'react-bootstrap/lib/Carousel';
import * as urlHelper from '../../utils/urlHelper';

class TripIndex extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {

    return (
      <Grid>
          <Carousel>
            <Carousel.Item>
            <img width={900} height={500} alt="900x500" className="flag-icon-background flag-icon-hr"/>
            <Carousel.Caption>
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
      </Grid>
    );
  }
}

export default TripIndex;

TripIndex.propTypes = {
  actions: React.PropTypes.object,
  trips: React.PropTypes.object
};