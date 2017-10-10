import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Pagination from 'react-bootstrap/lib/Pagination';
import PoiTable from './PoiTable';

const PoiPanel = (props) => {

    const header = `Pois (${props.pois.count})`;

  return (
                <Panel header={<h4>{header}</h4>}>
                    <Row>
                      <Col lg={12}>
                        <PoiTable pois={props.pois.items} />
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
                </Panel>
  );
};

export default PoiPanel;

PoiPanel.propTypes = {
};