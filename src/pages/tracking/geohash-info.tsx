import moment from 'moment';
import React from 'react';
import { Button, Card, Collapse } from 'react-bootstrap';
import { FaChevronDown, FaHashtag } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { MdToday } from 'react-icons/md';
import { ImSigma } from 'react-icons/im';

import { Geohash } from 'types/location';
import { number } from 'utils/format-helper';

interface Props {
    geohash: Geohash,
    onDelete(),
    onRemove(),
}

const GeohashInfo = ({ geohash, onDelete, onRemove }: Props) => {
    const [expanded, setExpanded] = React.useState(false);
    const formattedCount = number(geohash.totalCount);
    const detailsId = `geohash-info-${geohash.id}`;
    const firstIn = moment(geohash.firstIn);
    const lastIn = moment(geohash.lastIn);

    return (
        <Card style={{ borderTop: '4px solid #32a852' }}>
            <Card.Header className="p-0">
                <div className="d-flex align-items-stretch">
                    <button
                        type="button"
                        className="flex-grow-1 border-0 bg-transparent text-body text-start px-3 py-2"
                        style={{ cursor: 'pointer' }}
                        aria-expanded={expanded}
                        aria-controls={detailsId}
                        onClick={() => setExpanded(open => !open)}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <div className="flex-grow-1">
                                <div className="small text-muted fw-normal">Geohash</div>
                                <div className="fw-semibold text-nowrap">
                                    <FaHashtag className="me-1" aria-hidden />
                                    {geohash.id}
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="small text-muted fw-normal">Days</div>
                                <div className="fw-semibold text-nowrap">
                                    <MdToday className="me-1" aria-hidden />
                                    {geohash.dayCount}
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <div className="small text-muted fw-normal">Trackings</div>
                                <div className="fw-semibold text-nowrap">
                                    <ImSigma className="me-1" aria-hidden />
                                    {`${formattedCount.number}${formattedCount.exponent}`}
                                </div>
                            </div>
                            <FaChevronDown
                                className="flex-shrink-0 text-muted"
                                aria-hidden
                                style={{
                                    transform: expanded ? 'rotate(180deg)' : 'none',
                                    transition: 'transform 0.2s ease',
                                }}
                            />
                            <span className="visually-hidden">{expanded ? 'Collapse' : 'Expand'}</span>
                        </div>
                    </button>
                    <button
                        type="button"
                        className="border-0 bg-transparent text-body px-3"
                        style={{ cursor: 'pointer' }}
                        aria-label="Remove"
                        title="Remove"
                        onClick={onRemove}
                    >
                        <IoMdClose size={20} />
                    </button>
                </div>
            </Card.Header>
            <Collapse in={expanded}>
                <div id={detailsId}>
                    <Card.Body className="border-top">
                        <div className="d-flex flex-wrap gap-4 mb-3">
                            <div>
                                <div className="small text-muted">First in</div>
                                <div className="fw-semibold">{firstIn.format('HH:mm')}</div>
                                <div>{firstIn.format('dddd, D MMMM YYYY')}</div>
                            </div>
                            <div>
                                <div className="small text-muted">Last in</div>
                                <div className="fw-semibold">{lastIn.format('HH:mm')}</div>
                                <div>{lastIn.format('dddd, D MMMM YYYY')}</div>
                            </div>
                        </div>
                        <Button variant="danger" size="sm" onClick={onDelete}>
                            Delete {geohash.totalCount} trackings
                        </Button>
                    </Card.Body>
                </div>
            </Collapse>
        </Card>
    );
};

export default GeohashInfo;
