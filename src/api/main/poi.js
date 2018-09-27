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
    return api.get("poi", filters);
}
exports.get = get;
function post(poi) {
    return api.post("poi", poi);
}
exports.post = post;
