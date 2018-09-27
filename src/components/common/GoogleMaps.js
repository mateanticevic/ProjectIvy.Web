"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_google_maps_1 = require("react-google-maps");
const GoogleMaps = react_google_maps_1.withGoogleMap(props => (react_1.default.createElement(react_google_maps_1.GoogleMap, { onClick: props.onClick, onDragEnd: () => { if (props.onDragEnd) {
        props.onDragEnd();
    } }, defaultZoom: props.defaultZoom, center: props.defaultCenter, defaultCenter: props.defaultCenter }, props.children)));
exports.default = GoogleMaps;
