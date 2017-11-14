import * as api from '../config';

export function getExpenseFileTypes() {
    return api.get("common/expenseFileType");
}

export function getPoiCategories() {
    return api.get("common/poiCategory");
}