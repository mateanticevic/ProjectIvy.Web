import * as api from '../config';

export function getExpenseFileTypes() {
    return api.get("common/expenseFileType");
}

export function getPaymentTypes() {
    return api.get("common/paymentType");
}

export function getPoiCategories() {
    return api.get("common/poiCategory");
}

export function getBeerServing() {
    return api.get("common/beerServing");
}