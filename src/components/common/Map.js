"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const GoogleMaps_1 = __importDefault(require("./GoogleMaps"));
const Map = ({ map, onDragEnd, onClick, defaultZoom, defaultCenter, children }) => {
    return (react_1.default.createElement(GoogleMaps_1.default, { onClick: onClick, ref: map, onDragEnd: onDragEnd, defaultZoom: defaultZoom ? defaultZoom : 2, defaultCenter: defaultCenter ? defaultCenter : { lat: 0, lng: 0 }, containerElement: react_1.default.createElement("div", { style: { height: `100%` } }), mapElement: react_1.default.createElement("div", { style: { height: `100%` } }) }, children));
};
exports.default = Map;
