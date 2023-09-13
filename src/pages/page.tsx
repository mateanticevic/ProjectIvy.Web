import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton'

import * as urlHelper from 'utils/url-helper';

export class Page<TProps, TState> extends React.Component<TProps, TState> {

    public pushHistoryState(filters) {
        const queryString = urlHelper.jsonToQueryString(filters);
        const state = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

        window.history.pushState(null, null, state);
    }

    public resolveFilters(filters, filterValue) {
        return filterValue ? {
            ...filters,
            ...filterValue
        }
            : {
                ...filters,
                ...(urlHelper.queryStringToJson(window.location.search))
            };
    }

    protected renderDefaultSkeleton() {
        return (
            <Container>
                <Row>
                    <Col lg={3}>
                        <Row>
                            <Skeleton height={350} />
                        </Row>
                        <Row>
                            <Skeleton height={200} />
                        </Row>
                    </Col>
                    <Col lg={6}>
                        <Skeleton height={800} />
                    </Col>
                    <Col lg={3}>
                        <Skeleton height={200} />
                    </Col>
                </Row>
            </Container>
        );
    }
}
