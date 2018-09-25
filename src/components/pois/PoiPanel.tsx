import React from 'react';
import { Row, Col, Panel, Button } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';

import { PagedList } from '../../types/common';
import { Poi } from '../../types/pois';
import Pagination from '../common/Pagination';
import PoiTable from './PoiTable';

type Props = {
  addToTrip: (tripid: number) => void,
  onNewClick: () => void,
  onPageChange: (page: number) => void,
  page: number,
  pageSize: number,
  pois: PagedList<Poi>
};

const PoiPanel = ({ pois, addToTrip, onNewClick, onPageChange, page, pageSize }: Props) => {

  const header = `Pois (${pois.count})`;

  return (
    <Panel>
      <Panel.Heading>
        <Row>
          <Col xs={10}>
            {header}
          </Col>
          <Col xs={2}>
            {onNewClick &&
              <Button className="pull-right" bsStyle="primary" bsSize="xsmall" onClick={onNewClick}><FontAwesome name="plus" /> New</Button>
            }
          </Col>
        </Row>
      </Panel.Heading>
      <Panel.Body>
        <Row>
          <Col lg={12}>
            <PoiTable pois={pois.items} addToTrip={addToTrip} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Pagination page={page}
              pages={Math.ceil(pois.count / pageSize)}
              onPageChange={onPageChange} />
          </Col>
        </Row>
      </Panel.Body>
    </Panel>
  );
};

export default PoiPanel;