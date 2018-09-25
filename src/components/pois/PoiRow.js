"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_fontawesome_1 = __importDefault(require("react-fontawesome"));
const lib_1 = require("react-bootstrap/lib");
const PoiRow = ({ poi, addToTrip }) => {
    return (react_1.default.createElement("tr", null,
        react_1.default.createElement("td", null, poi.name),
        react_1.default.createElement("td", null, poi.category.name),
        react_1.default.createElement("td", null, poi.address),
        react_1.default.createElement("td", null,
            react_1.default.createElement(lib_1.Button, { className: "pull-right", bsStyle: "primary", bsSize: "xsmall", onClick: () => addToTrip(poi.id) },
                react_1.default.createElement(react_fontawesome_1.default, { name: "link" }),
                " Link to trip")),
        react_1.default.createElement("td", null,
            react_1.default.createElement(lib_1.Button, { className: "pull-right", bsStyle: "primary", bsSize: "xsmall" },
                react_1.default.createElement(react_fontawesome_1.default, { name: "map" }),
                " Show"))));
};
exports.default = PoiRow;
