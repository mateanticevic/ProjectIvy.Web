"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const lib_1 = require("react-bootstrap/lib");
const Select_1 = __importDefault(require("../common/Select"));
const PoiModal = ({ categories, isOpen, onClose, onPoiChange, onSave, poi }) => {
    return (react_1.default.createElement(lib_1.Modal, { show: isOpen, onHide: onClose },
        react_1.default.createElement(lib_1.Modal.Header, { closeButton: true },
            react_1.default.createElement(lib_1.Modal.Title, null, "New poi")),
        react_1.default.createElement(lib_1.Modal.Body, null,
            react_1.default.createElement(lib_1.Row, null,
                react_1.default.createElement(lib_1.Col, { lg: 6 },
                    react_1.default.createElement(lib_1.FormGroup, null,
                        react_1.default.createElement(lib_1.ControlLabel, null, "Name"),
                        react_1.default.createElement(lib_1.FormControl, { value: poi.name, type: "text", onChange: x => onPoiChange({ name: x.target.value }) }))),
                react_1.default.createElement(lib_1.Col, { lg: 6 },
                    react_1.default.createElement(lib_1.FormGroup, null,
                        react_1.default.createElement(lib_1.ControlLabel, null, "Category"),
                        react_1.default.createElement(Select_1.default, { options: categories, selected: poi.poiCategoryId, onChange: x => onPoiChange({ poiCategoryId: x }), hideDefaultOption: true })))),
            react_1.default.createElement(lib_1.Row, null,
                react_1.default.createElement(lib_1.Col, { lg: 6 },
                    react_1.default.createElement(lib_1.FormGroup, null,
                        react_1.default.createElement(lib_1.ControlLabel, null, "Latitude"),
                        react_1.default.createElement(lib_1.FormControl, { value: poi.latitude, type: "number", onChange: x => onPoiChange({ latitude: x.target.value }) }))),
                react_1.default.createElement(lib_1.Col, { lg: 6 },
                    react_1.default.createElement(lib_1.FormGroup, null,
                        react_1.default.createElement(lib_1.ControlLabel, null, "Longitude"),
                        react_1.default.createElement(lib_1.FormControl, { value: poi.longitude, type: "number", onChange: x => onPoiChange({ longitude: x.target.value }) })))),
            react_1.default.createElement(lib_1.Row, null,
                react_1.default.createElement(lib_1.Col, { lg: 12 },
                    react_1.default.createElement(lib_1.FormGroup, null,
                        react_1.default.createElement(lib_1.ControlLabel, null, "Address"),
                        react_1.default.createElement(lib_1.FormControl, { value: poi.address, type: "text", onChange: x => onPoiChange({ address: x.target.value }) }))))),
        react_1.default.createElement(lib_1.Modal.Footer, null,
            react_1.default.createElement(lib_1.Button, { onClick: onSave }, "Save"))));
};
exports.default = PoiModal;
