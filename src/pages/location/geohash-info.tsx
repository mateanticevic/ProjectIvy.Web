import moment from 'moment';
import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import { BsBoxArrowInLeft } from 'react-icons/bs';
import { MdToday } from 'react-icons/md';
import { ImSigma } from 'react-icons/im';

import { GeohashItem } from 'types/location';
import { number } from 'utils/format-helper';

interface Props {
    geohash: GeohashItem,
}

const GeohashInfo = ({ geohash }: Props) => {

    const formattedCount = number(geohash.geohash.totalCount);

    return (
        <Card>
            <Card.Body>
                <h5>
                    <Badge bg="primary">
                        {`#${geohash.geohash.id}`}
                    </Badge>
                </h5>
                <h5>
                    <Badge bg="primary">
                        1st <BsBoxArrowInLeft /> {moment(geohash.geohash.firstIn).format('HH:mm MMM Do YYYY')}
                    </Badge>
                </h5>
                <h5>
                    <Badge bg="primary">
                        last <BsBoxArrowInLeft /> {moment(geohash.geohash.lastIn).format('HH:mm MMM Do YYYY')}
                    </Badge>
                </h5>
                <h5>
                    <Badge bg="primary">
                        <MdToday /> {geohash.geohash.dayCount}
                    </Badge>
                </h5>
                <h5>
                    <Badge bg="primary">
                        <ImSigma /> {`${formattedCount.number}${formattedCount.exponent}`}
                    </Badge>
                </h5>
            </Card.Body>
        </Card>
    );

};

export default GeohashInfo;