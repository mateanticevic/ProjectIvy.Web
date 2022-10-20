import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import * as formatHelper from 'utils/format-helper';

const WidgetCard = (props) => {

    const formatted = formatHelper.number(props.value);
    let value = `${formatted.number}${formatted.exponent}`;

    if (props.unit) {
        value +=  ` ${props.unit}`;
    }

    return (
        <Container>
            <Row>
                <Col lg={12}>{props.title}</Col>
            </Row>
            <Row>
                <Col lg={12}>
                    <h3 style={{ margin: '0px' }}>{value}</h3>
                </Col>
            </Row>
        </Container>
    );
};

export default WidgetCard;
