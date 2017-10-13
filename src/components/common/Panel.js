import React from 'react';
import { Row, Col, Button } from 'react-bootstrap/lib';
import FontAwesome from 'react-fontawesome';

const Panel = (props) => {
    return (
        <div className="panel panel-default">
            <div className="panel-heading">
                <Row>
                    <Col lg={6}>
                        <h4 className="panel-title">{props.header}</h4>
                    </Col>
                    <Col lg={6}>
                        {props.onNewClick &&
                            <Button className="pull-right" bsSize="xsmall" onClick={props.onNewClick}><FontAwesome name="plus" /> New</Button>
                        }
                    </Col>
                </Row>
            </div>
            <div className="panel-body">{props.children}</div>
        </div>
    );
}

export default Panel;