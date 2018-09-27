"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const FormControl_1 = __importDefault(require("react-bootstrap/lib/FormControl"));
const Select = ({ options, onChange, defaultOptionId, defaultOptionValue, selected, hideDefaultOption }) => {
    defaultOptionId = defaultOptionId ? defaultOptionId : undefined;
    defaultOptionValue = defaultOptionValue ? defaultOptionValue : 'Any';
    let t = options && options[0] && options[0].id ? options : options.map(item => { return { id: item, name: item }; });
    options = t.map(option => react_1.default.createElement("option", { key: option.id, value: option.id }, option.name));
    return (react_1.default.createElement(FormControl_1.default, { value: selected, componentClass: "select", onChange: e => onChange(e.target.value), placeholder: "select" },
        !hideDefaultOption &&
            react_1.default.createElement("option", { value: defaultOptionId }, defaultOptionValue),
        options));
};
exports.default = Select;
