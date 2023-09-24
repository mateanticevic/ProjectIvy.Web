import React from 'react';
import { Modal } from 'react-bootstrap';
import CalendarHeatmap from 'react-calendar-heatmap';

import { KeyValuePair } from 'types/grouping';

interface Props {
    dates: KeyValuePair<number>[];
    isOpen: boolean;
    onClose(): void;
}

const valueToClass = (value) => {
    if (!value)
        return 'background-inactive';

    if (value.count > 0 && value.count <= 1)
        return 'fill-count-1';

    if (value.count > 1 && value.count <= 2)
        return 'fill-count-2';

    if (value.count > 4)
        return 'fill-count-4';

    return `fill-count-5`;
};

const ConsumationModal = ({ dates, isOpen, onClose }: Props) => {

    const year = new Date(dates[0].key).getFullYear();

    return (
        <Modal
            backdrop="static"
            show={isOpen}
            onHide={onClose}
            size="xl"
        >
            <Modal.Header closeButton>
                <Modal.Title>New consumation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CalendarHeatmap
                    startDate={new Date(`${year}-1-1`)}
                    endDate={new Date(`${year}-12-31`)}
                    values={dates.map(value => {
                        return {
                            count: value.value / 1000,
                            date: new Date(value.key),
                        };
                    })}
                    classForValue={valueToClass}
                    titleForValue={value => value ? `On ${value.date.toDateString()}, drank ${value.count}L` : undefined}
                    showMonthLabels={false}
                />
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    );
};

export default ConsumationModal;
