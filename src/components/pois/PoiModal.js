import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Select from '../common/Select';
import Button from 'react-bootstrap/lib/Button';

const PoiModal = (props) => {

  return (
    <Modal show={props.isOpen} onHide={props.onClose}>
        <Modal.Header closeButton>
            <Modal.Title>New poi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Row>
                <Col lg={6}>
                    <FormGroup>
                        <ControlLabel>Name</ControlLabel>
                        <FormControl value={props.poi.name} type="text" onChange={x => props.onPoiChange({name: x.target.value})} />
                    </FormGroup>
                </Col>
                <Col lg={6}>
                    <FormGroup>
                        <ControlLabel>Category</ControlLabel>
                        <Select options={props.categories} selected={props.poi.poiCategoryId} onChange={x => props.onPoiChange({poiCategoryId: x})} hideDefaultOption={true} />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <FormGroup>
                        <ControlLabel>Latitude</ControlLabel>
                        <FormControl value={props.poi.latitude} type="text" onChange={x => props.onPoiChange({latitude: x.target.value})} />
                    </FormGroup>
                </Col>
                <Col lg={6}>
                    <FormGroup>
                        <ControlLabel>Longitude</ControlLabel>
                        <FormControl value={props.poi.longitude} type="text" onChange={x => props.onPoiChange({longitude: x.target.value})} />
                    </FormGroup>
                </Col>
            </Row>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onSave}>Save</Button>
        </Modal.Footer>
    </Modal>
  );
};

export default PoiModal;

PoiModal.propTypes = {
};