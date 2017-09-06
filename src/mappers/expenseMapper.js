import moment from 'moment';

export function toBindingModel(e){
    return {
        id: e.id,
        amount: e.amount,
        comment: e.comment,
        cardId : e.card ? e.card.id : undefined,
        currencyId: e.currency.id,
        date: moment(e.date).format("YYYY-MM-DD"),
        expenseTypeId: e.expenseType.id,
        paymentTypeId: e.paymentType ? e.paymentType.id : undefined,
        poiId: e.poi ? e.poi.id : undefined,
        vendorId: e.vendor ? e.vendor.id : undefined
    };
}