import React from 'react';
import { Button, Col, Panel, Row } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';

import Pagination from '../../components/Pagination';
import { PagedItems } from '../../types/common';
import { Poi } from '../../types/pois';
import PoiTable from './PoiTable';

interface Props {
  addToTrip: (tripId: string) => void;
  onNewClick: () => void;
  onPageChange: (page: number) => void;
  pagedItems: PagedItems<Poi>;
}

const PoiPanel: React.SFC<Props> = ({ pagedItems, addToTrip, onNewClick, onPageChange }) => {

  const header = `Pois (${pagedItems.list.count})`;

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
            <PoiTable pois={pagedItems.list.items} addToTrip={addToTrip} />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Pagination page={pagedItems.page}
              pages={Math.ceil(pagedItems.list.count / pagedItems.pageSize)}
              onPageChange={onPageChange} />
          </Col>
        </Row>
      </Panel.Body>
    </Panel>
  );
};

export default PoiPanel;
