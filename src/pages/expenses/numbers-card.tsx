import React from 'react';
import { Badge, Card, ListGroup, ListGroupItem } from 'react-bootstrap';

import { AmountInCurrency } from 'types/expenses';

interface Props {
    expenseCount: number;
    typeCount: number;
    vendorCount: number;
    sum: number;
    sumByCurrency: AmountInCurrency[];
}

const NumbersCard = ({ expenseCount, typeCount, vendorCount, sum, sumByCurrency }: Props) => {
    return (
        <Card>
            <Card.Header>Numbers</Card.Header>
            <Card.Body className="padding-0">
                <ListGroup>
                    <ListGroupItem>
                        Count
                        <span className="pull-right">{expenseCount}</span>
                    </ListGroupItem>
                    <ListGroupItem>
                        Types
                        <span className="pull-right">{typeCount}</span>
                    </ListGroupItem>
                    <ListGroupItem>
                        Vendors
                        <span className="pull-right">{vendorCount}</span>
                    </ListGroupItem>
                    <ListGroupItem>
                        Total
                        <span className="pull-right">{sum.toFixed(2)} <Badge bg="primary">HRK</Badge></span>
                    </ListGroupItem>
                </ListGroup>
                <br />
                <ListGroup>
                    {sumByCurrency.map(item =>
                        <ListGroupItem key={item.key.id}>
                            {item.key.name}
                            <span className="pull-right">{item.value.toFixed(2)} <Badge bg="primary">{item.key.id}</Badge></span>
                        </ListGroupItem>
                    )}
                </ListGroup>
            </Card.Body>
        </Card>
    );
};

export default NumbersCard;
