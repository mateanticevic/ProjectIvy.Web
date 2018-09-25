"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Table_1 = __importDefault(require("react-bootstrap/lib/Table"));
const PoiRow_1 = __importDefault(require("./PoiRow"));
const PoiTable = ({ addToTrip, pois }) => {
    const rows = pois.map(function (poi) {
        return react_1.default.createElement(PoiRow_1.default, { key: poi.id, poi: poi, addToTrip: addToTrip });
    });
    return (react_1.default.createElement(Table_1.default, null,
        react_1.default.createElement("thead", null,
            react_1.default.createElement("tr", null,
                react_1.default.createElement("th", null, "Name"),
                react_1.default.createElement("th", null, "Category"),
                react_1.default.createElement("th", null, "Address"),
                react_1.default.createElement("th", null),
                react_1.default.createElement("th", null))),
        react_1.default.createElement("tbody", null, rows)));
};
exports.default = PoiTable;
