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
function get(filters) {
    return api.get("trip", filters);
}
exports.get = get;
function getById(tripId) {
    return api.get(`trip/${tripId}`);
}
exports.getById = getById;
function deleteExpense(tripId, expenseId) {
    return api.del(`trip/${tripId}/expense/${expenseId}`);
}
exports.deleteExpense = deleteExpense;
function postPoi(tripId, poiId) {
    return api.post(`trip/${tripId}/poi/${poiId}`);
}
exports.postPoi = postPoi;
