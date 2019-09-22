import React from 'react';
import { Button, Col, ControlLabel, FormControl, FormGroup, Modal, Row } from 'react-bootstrap/lib';

import Select from '../../components/Select';
import { Poi } from '../../types/pois';

interface Props {
    isOpen: boolean,
    categories: any[],
    onClose: () => void,
    onPoiChange: (poi: any) => void,
    onSave: () => void,
    poi: Poi
}

const PoiModal: React.SFC<Props> = ({ categories, isOpen, onClose, onPoiChange, onSave, poi }) => {

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>New poi</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col lg={6}>
                        <FormGroup>
                            <ControlLabel>Name</ControlLabel>
                            <FormControl value={poi.name} type="text" onChange={(x) => onPoiChange({ name: (x.target as HTMLInputElement).value })} />
                        </FormGroup>
                    </Col>
                    <Col lg={6}>
                        <FormGroup>
                            <ControlLabel>Category</ControlLabel>
                            <Select options={categories} selected={poi.poiCategoryId} onChange={(x) => onPoiChange({ poiCategoryId: x })} hideDefaultOption={true} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col lg={6}>
                        <FormGroup>
                            <ControlLabel>Latitude</ControlLabel>
                            <FormControl value={poi.latitude} type="number" onChange={(x) => onPoiChange({ latitude: (x.target as HTMLInputElement).value })} />
                        </FormGroup>
                    </Col>
                    <Col lg={6}>
                        <FormGroup>
                            <ControlLabel>Longitude</ControlLabel>
                            <FormControl value={poi.longitude} type="number" onChange={(x) => onPoiChange({ longitude: (x.target as HTMLInputElement).value })} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <FormGroup>
                            <ControlLabel>Address</ControlLabel>
                            <FormControl value={poi.address} type="text" onChange={(x) => onPoiChange({ address: (x.target as HTMLInputElement).value })} />
                        </FormGroup>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onSave}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PoiModal;
