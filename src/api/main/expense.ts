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

const getSumByCurrency = (filters) => api.get('expense/sum/byCurrency', filters);

const getSumByDayOfWeek = (filters) => api.get('expense/sum/byDayOfWeek', filters);

const getSumByMonth = (filters) => api.get('expense/sum/byMonth', filters);

const getSumByMonthOfYear = (filters) => api.get('expense/sum/byMonthOfYear', filters);

const getSumByMonthOfYearByType = (filters) => api.get('expense/sum/byMonthOfYear/byType', filters);

const getSumByYear = (filters) => api.get('expense/sum/byYear', filters);

const getSumByYearByType = (filters) => api.get('expense/sum/byYear/byType', filters);

const post = (expense) => api.post('expense', expense);

const postExpenseFromFile = (file) => api.postFile('expense/fromFile', file);

const postFile = (expenseId, fileId, payload) => api.post(`expense/${expenseId}/file/${fileId}`, payload);

const put = (expense) => api.put(`expense/${expense.id}`, expense);

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
    getSumByCurrency,
    getSumByDayOfWeek,
    getSumByMonth,
    getSumByMonthOfYear,
    getSumByMonthOfYearByType,
    getSumByYear,
    getSumByYearByType,
    post,
    put,
    postExpenseFromFile,
    postFile,
};

export default expense;
