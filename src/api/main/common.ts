import * as api from '../config';

const getAirlines = (filters) => api.get('common/airline', filters);

function getExpenseFileTypes() {
    return api.get('common/expenseFileType');
}

function getPaymentTypes() {
    return api.get('common/paymentType');
}

function getPoiCategories() {
    return api.get('common/poiCategory');
}

function getBeerServing() {
    return api.get('common/beerServing');
}

const getIncomeTypes = () => api.get('common/incomeType');

const getBeerStyles = () => api.get('common/beerStyle');

const common = {
    getAirlines,
    getExpenseFileTypes,
    getIncomeTypes,
    getPaymentTypes,
    getPoiCategories,
    getBeerServing,
    getBeerStyles
};

export default common;
