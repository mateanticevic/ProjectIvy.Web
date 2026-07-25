import React from 'react';
import { Modal } from 'react-bootstrap';
import Chart from 'react-google-charts';

import colorTokens from 'styles/color-tokens.module.scss';
import { Country, KeyValue } from 'types/common';

interface Props {
    isOpen: boolean;
    sumByCountry: KeyValue<Country, number>[];
    onClose(): void;
}

const tintColor = (hex: string, amount: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const t = (c: number) => Math.round(c + (255 - c) * amount).toString(16).padStart(2, '0');
    return `#${t(r)}${t(g)}${t(b)}`;
};

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
                    options={{ colorAxis: { colors: [tintColor(colorTokens.colorPrimary, 0.8), colorTokens.colorPrimary] } }}
                />
            </Modal.Body>
        </Modal>
    );
};

export default CountryMapModal;
