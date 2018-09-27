"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const api = __importStar(require("../config"));
function getExpenseFileTypes() {
    return api.get("common/expenseFileType");
}
exports.getExpenseFileTypes = getExpenseFileTypes;
function getPaymentTypes() {
    return api.get("common/paymentType");
}
exports.getPaymentTypes = getPaymentTypes;
function getPoiCategories() {
    return api.get("common/poiCategory");
}
exports.getPoiCategories = getPoiCategories;
function getBeerServing() {
    return api.get("common/beerServing");
}
exports.getBeerServing = getBeerServing;
