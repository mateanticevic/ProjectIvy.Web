import * as api from '../config';

function getExpenseFileTypes() {
    return api.get("common/expenseFileType");
}

function getPaymentTypes() {
    return api.get("common/paymentType");
}

function getPoiCategories() {
    return api.get("common/poiCategory");
}

function getBeerServing() {
    return api.get("common/beerServing");
}

const commonApi = {
    getExpenseFileTypes,
    getPaymentTypes,
    getPoiCategories,
    getBeerServing
}

export default commonApi;