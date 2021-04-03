import React from 'react';
import { Button, Col, Card, Row } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import Pagination from '~components/Pagination';
import { PagedItems } from '~types/common';
import { Poi } from '~types/pois';
import PoiTable from './PoiTable';

interface Props {
  pagedItems: PagedItems<Poi>;
  addToTrip: (tripId: string) => void;
  onNewClick: () => void;
  onPageChange: (page: number) => void;
}

const PoiPanel: React.SFC<Props> = ({ pagedItems, addToTrip, onNewClick, onPageChange }) => {

    const header = `Pois (${pagedItems.list.count})`;

    return (
        <Card>
            <Card.Header>
                <Row>
                    <Col xs={10}>
                        {header}
                    </Col>
                    <Col xs={2}>
                        {onNewClick &&
              <Button className="pull-right" variant="primary" size="xsmall" onClick={onNewClick}><FontAwesome name="plus" /> New</Button>
                        }
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
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
            </Card.Body>
        </Card>
    );
};

export default PoiPanel;
