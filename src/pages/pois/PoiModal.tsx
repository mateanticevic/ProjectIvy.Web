import React from 'react';
import { Button, Col, FormLabel, FormControl, FormGroup, Modal, Row } from 'react-bootstrap';

import Select from '~components/Select';
import { Poi } from '~types/pois';

interface Props {
    isOpen: boolean;
    categories: any[];
    onClose: () => void;
    onPoiChange: (poi: any) => void;
    onSave: () => void;
    poi: Poi;
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
                            <FormLabel>Name</FormLabel>
                            <FormControl value={poi.name} type="text" onChange={(x) => onPoiChange({ name: (x.target as HTMLInputElement).value })} />
                        </FormGroup>
                    </Col>
                    <Col lg={6}>
                        <FormGroup>
                            <FormLabel>Category</FormLabel>
                            <Select options={categories} selected={poi.poiCategoryId} onChange={(x) => onPoiChange({ poiCategoryId: x })} hideDefaultOption={true} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col lg={6}>
                        <FormGroup>
                            <FormLabel>Latitude</FormLabel>
                            <FormControl value={poi.latitude} type="number" onChange={(x) => onPoiChange({ latitude: (x.target as HTMLInputElement).value })} />
                        </FormGroup>
                    </Col>
                    <Col lg={6}>
                        <FormGroup>
                            <FormLabel>Longitude</FormLabel>
                            <FormControl value={poi.longitude} type="number" onChange={(x) => onPoiChange({ longitude: (x.target as HTMLInputElement).value })} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <FormGroup>
                            <FormLabel>Address</FormLabel>
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
