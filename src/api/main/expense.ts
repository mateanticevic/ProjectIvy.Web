import * as api from '../config';

function get(filters) {
    return api.get('expense', filters);
}

function getCountByDay(filters) {
    return api.get('expense/count/byday', filters);
}

function getCountByDayOfWeek(filters) {
    return api.get('expense/count/bydayofweek', filters);
}

function getCountByMonth(filters) {
    return api.get('expense/count/bymonth', filters);
}

function getCountByMonthOfYear(filters) {
    return api.get('expense/count/bymonthofyear', filters);
}

function getCountByType(filters) {
    return api.get('expense/count/bytype', filters);
}

function getCountByYear(filters) {
    return api.get('expense/count/byyear', filters);
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

const getTopDescriptions = (filters) => api.get('expense/top/description', filters);

function getTypeCount(filters) {
    return api.get('expense/type/count', filters);
}

function getVendorCount(filters) {
    return api.get('expense/vendor/count', filters);
}

const getSumByMonth = (filters) => api.get('expense/sum/byMonth', filters);

const getSumByMonthOfYear = (filters) => api.get('expense/sum/byMonthOfYear', filters);

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
    getCountByDayOfWeek,
    getCountByMonth,
    getCountByMonthOfYear,
    getCountByType,
    getCountByVendor,
    getCountByYear,
    getFiles,
    getTopDescriptions,
    getTypeCount,
    getVendorCount,
    getSum,
    getSumByMonth,
    getSumByMonthOfYear,
    getSumByYear,
    post,
    put,
    postFile,
};

export default expense;
