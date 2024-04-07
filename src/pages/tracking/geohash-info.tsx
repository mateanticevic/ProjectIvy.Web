import moment from 'moment';
import React from 'react';
import { Badge, Button, Card } from 'react-bootstrap';
import { BsBoxArrowInLeft } from 'react-icons/bs';
import { MdToday } from 'react-icons/md';
import { ImSigma } from 'react-icons/im';

import { Geohash, GeohashItem } from 'types/location';
import { number } from 'utils/format-helper';

interface Props {
    geohash: Geohash,
    onDelete(),
}

const GeohashInfo = ({ geohash, onDelete }: Props) => {

    const formattedCount = number(geohash.totalCount);

    return (
        <Card>
            <Card.Body>
                <h5>
                    <Badge bg="primary">
                        {`#${geohash.id}`}
                    </Badge>
                </h5>
                <h5>
                    <Badge bg="primary">
                        1st <BsBoxArrowInLeft /> {moment(geohash.firstIn).format('HH:mm MMM Do YYYY')}
                    </Badge>
                </h5>
                <h5>
                    <Badge bg="primary">
                        last <BsBoxArrowInLeft /> {moment(geohash.lastIn).format('HH:mm MMM Do YYYY')}
                    </Badge>
                </h5>
                <h5>
                    <Badge bg="primary">
                        <MdToday /> {geohash.dayCount}
                    </Badge>
                </h5>
                <h5>
                    <Badge bg="primary">
                        <ImSigma /> {`${formattedCount.number}${formattedCount.exponent}`}
                    </Badge>
                </h5>
                <Button variant="danger" onClick={onDelete}>Delete {geohash.totalCount} trackings</Button>
            </Card.Body>
        </Card>
    );

};

export default GeohashInfo;