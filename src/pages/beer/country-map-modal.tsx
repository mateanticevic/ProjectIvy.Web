import React from 'react';
import { Modal } from 'react-bootstrap';
import Chart from 'react-google-charts';
import { Country, KeyValue } from 'types/common';

interface Props {
    isOpen: boolean;
    sumByCountry: KeyValue<Country, number>[];
    onClose(): void;
}

const CountryMapModal = ({ isOpen, sumByCountry, onClose }: Props) => {
    const mapData = [
        ['Country', 'Liters'],
        ...sumByCountry.map(x => [x.key.name, Math.ceil(x.value / 1000)]),
    ];

    return (
        <Modal
            backdrop="static"
            show={isOpen}
            onHide={onClose}
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>Countries by volume</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Chart
                    height="360px"
                    chartType="GeoChart"
                    data={mapData}
                    options={{ colorAxis: { colors: ['#a5cefa', '#007BFB'] } }}
                />
            </Modal.Body>
        </Modal>
    );
};

export default CountryMapModal;
