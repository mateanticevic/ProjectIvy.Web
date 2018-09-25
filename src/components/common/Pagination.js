"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const lodash_1 = __importDefault(require("lodash"));
const Pagination_1 = __importDefault(require("react-bootstrap/lib/Pagination"));
const Pagination = ({ showPages, page, pages, onPageChange }) => {
    showPages = showPages ? showPages : 5;
    const startPage = page > 2 ? (page + showPages > pages ? (pages - showPages < 0 ? 1 : pages - showPages + 1) : page - 2) : 1;
    const endPage = startPage + showPages > pages ? pages : startPage + showPages - 1;
    const items = lodash_1.default.range(startPage, endPage + 1).map(item => react_1.default.createElement(Pagination_1.default.Item, { key: lodash_1.default.uniqueId('pagination_item_'), active: item === page, onClick: () => onPageChange(item) }, item));
    return (react_1.default.createElement(Pagination_1.default, null, items));
};
exports.default = Pagination;
