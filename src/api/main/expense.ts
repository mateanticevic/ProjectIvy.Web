import * as api from '../config';

function get(filters) {
    return api.get('expense', filters);
}

function getCountByDay(filters) {
    return api.get('expense/count/byday', filters);
}

function getCountByMonth(filters) {
    return api.get('expense/count/bymonth', filters);
}

function getCountByType(filters) {
    return api.get('expense/count/bytype', filters);
}

function getCountByVendor(filters) {
    return api.get('expense/count/byvendor', filters);
}

function getFiles(expenseId) {
    return api.get(`expense/${expenseId}/file`);
}

function getSum(filters) {
    return api.get('expense/sum', filters);
}

function getTypeCount(filters) {
    return api.get('expense/type/count', filters);
}

function getVendorCount(filters) {
    return api.get('expense/vendor/count', filters);
}

function getSumByMonth(filters) {
    return api.get('expense/sum/bymonth', filters);
}

function getSumByYear(filters) {
    return api.get('expense/sum/byyear', filters);
}

function post(expense) {
    return api.post('expense', expense);
}

function put(expense) {
    return api.put(`expense/${expense.id}`, expense);
}

function postFile(expenseId, fileId, payload) {
    return api.post(`expense/${expenseId}/file/${fileId}`, payload);
}

const expense = {
    get,
    getCountByDay,
    getCountByMonth,
    getCountByType,
    getCountByVendor,
    getFiles,
    getSum,
    getTypeCount,
    getVendorCount,
    getSumByMonth,
    getSumByYear,
    post,
    put,
    postFile,
};

export default expense;
