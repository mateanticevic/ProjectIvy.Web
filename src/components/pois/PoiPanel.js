"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const lib_1 = require("react-bootstrap/lib");
const react_fontawesome_1 = __importDefault(require("react-fontawesome"));
const Pagination_1 = __importDefault(require("../common/Pagination"));
const PoiTable_1 = __importDefault(require("./PoiTable"));
const PoiPanel = ({ pagedItems, addToTrip, onNewClick, onPageChange }) => {
    const header = `Pois (${pagedItems.list.count})`;
    return (react_1.default.createElement(lib_1.Panel, null,
        react_1.default.createElement(lib_1.Panel.Heading, null,
            react_1.default.createElement(lib_1.Row, null,
                react_1.default.createElement(lib_1.Col, { xs: 10 }, header),
                react_1.default.createElement(lib_1.Col, { xs: 2 }, onNewClick &&
                    react_1.default.createElement(lib_1.Button, { className: "pull-right", bsStyle: "primary", bsSize: "xsmall", onClick: onNewClick },
                        react_1.default.createElement(react_fontawesome_1.default, { name: "plus" }),
                        " New")))),
        react_1.default.createElement(lib_1.Panel.Body, null,
            react_1.default.createElement(lib_1.Row, null,
                react_1.default.createElement(lib_1.Col, { lg: 12 },
                    react_1.default.createElement(PoiTable_1.default, { pois: pagedItems.list.items, addToTrip: addToTrip }))),
            react_1.default.createElement(lib_1.Row, null,
                react_1.default.createElement(lib_1.Col, { lg: 12 },
                    react_1.default.createElement(Pagination_1.default, { page: pagedItems.page, pages: Math.ceil(pagedItems.list.count / pagedItems.pageSize), onPageChange: onPageChange }))))));
};
exports.default = PoiPanel;
