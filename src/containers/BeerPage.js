import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col, Panel, Table } from 'react-bootstrap/lib';
import Moment from 'react-moment';

import * as actions from '../actions/beerActions';

class BeerPage extends React.Component {

  constructor(props, context) {
    super(props, context);

    props.actions.getConsumations();
    props.actions.getConsumationSum();
  }

  render() {

    const consumations = this.props.beer.consumations.items.map(consumation => <tr>
      <td><Moment format="Do MMMM YYYY">{consumation.date}</Moment></td>
      <td>{consumation.beer.name}</td>
      <td>{consumation.serving}</td>
      <td>{consumation.volume / 1000}L</td>
    </tr>);

    return (
      <Grid>
        <Row>
          <Col lg={3}>
            <Panel>
              <Panel.Heading>Filters</Panel.Heading>
              <Panel.Body>
              </Panel.Body>
            </Panel>
          </Col>
          <Col lg={9}>
            <Panel>
              <Panel.Heading>Consumations</Panel.Heading>
              <Panel.Body>
                <Table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Beer</th>
                      <th>Serving</th>
                      <th>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumations}
                  </tbody>
                </Table>
              </Panel.Body>
              <Panel.Footer>
                Sum ~{this.props.beer.sum/1000}L
              </Panel.Footer>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

BeerPage.propTypes = {
  actions: PropTypes.object.isRequired,
  beer: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    beer: state.beer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BeerPage);
