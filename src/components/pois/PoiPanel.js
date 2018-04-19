import React from 'react';
import { Row, Col, Pagination, Panel, Button } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';

import PoiTable from './PoiTable';

const PoiPanel = (props) => {

  const header = `Pois (${props.pois.count})`;

  return (
    <Panel>
      <Panel.Heading>
        <Row>
          <Col xs={10}>
            {header}
          </Col>
          <Col xs={2}>
            {props.onNewClick &&
              <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={props.onNewClick}><FontAwesome name="plus" /> New</Button>
            }
          </Col>
        </Row>
      </Panel.Heading>
      <Panel.Body>
        <Row>
          <Col lg={12}>
            <PoiTable pois={props.pois.items} addToTrip={props.addToTrip} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Pagination prev next first last ellipsis boundaryLinks items={Math.ceil(props.pois.count / props.pageSize)}
              maxButtons={5}
              activePage={props.page}
              onSelect={page => props.onPageChange(page)} />
          </Col>
        </Row>
      </Panel.Body>
    </Panel>
  );
};

export default PoiPanel;

PoiPanel.propTypes = {
};