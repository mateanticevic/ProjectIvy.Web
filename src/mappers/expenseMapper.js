import moment from 'moment';

export function toBindingModel(e){
    return {
        id: e.id,
        amount: e.amount,
        comment: e.comment,
        cardId : e.card ? e.card.id : undefined,
        created: e.timestamp ? moment(e.timestamp).format("YYYY-MM-DD hh:mm") : null,
        currencyId: e.currency.id,
        date: moment(e.date).format("YYYY-MM-DD"),
        files: e.files,
        modified: e.modified ? moment(e.modified).format("YYYY-MM-DD hh:mm") : null,
        expenseTypeId: e.expenseType.id,
        paymentTypeId: e.paymentType ? e.paymentType.id : undefined,
        parentCurrencyId: e.parentCurrency ? e.parentCurrency.id : undefined,
        parentCurrencyExchangeRate: e.parentCurrencyExchangeRate,
        poiId: e.poi ? e.poi.id : undefined,
        vendorId: e.vendor ? e.vendor.id : undefined
    };
}