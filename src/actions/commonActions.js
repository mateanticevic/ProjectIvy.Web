"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const types = __importStar(require("../constants/commonActionTypes"));
const commonApi = __importStar(require("../api/main/common"));
const vendorApi = __importStar(require("../api/main/vendor"));
function getExpenseFileTypes() {
    return function (dispatch) {
        return commonApi.getExpenseFileTypes().then(json => { dispatch(getExpenseFileTypesSuccess(json)); });
    };
}
exports.getExpenseFileTypes = getExpenseFileTypes;
function getExpenseFileTypesSuccess(expenseFileTypes) {
    return { type: types.GET_EXPENSE_FILE_TYPES_SUCCESS, expenseFileTypes };
}
exports.getExpenseFileTypesSuccess = getExpenseFileTypesSuccess;
function getPoiCategories() {
    return function (dispatch) {
        return commonApi.getPoiCategories().then(json => { dispatch(getPoiCategoriesSuccess(json)); });
    };
}
exports.getPoiCategories = getPoiCategories;
function getPoiCategoriesSuccess(poiCategories) {
    return { type: types.GET_POI_CATEGORIES_SUCCESS, poiCategories };
}
exports.getPoiCategoriesSuccess = getPoiCategoriesSuccess;
function getVendors() {
    return function (dispatch) {
        return vendorApi.get().then(json => { dispatch(getVendorsSuccess(json)); });
    };
}
exports.getVendors = getVendors;
function getVendorsSuccess(vendors) {
    return { type: types.GET_VENDORS_SUCCESS, vendors };
}
exports.getVendorsSuccess = getVendorsSuccess;
