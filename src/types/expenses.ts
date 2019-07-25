export type Currency = {
    id: string,
    code: string,
    name: string,
    symbol: string
}

export type Expense = {
    amount: number,
    card: { id: string, name: string },
    comment: string,
    currency: Currency,
    date: string,
    expenseType: ExpenseType,
    files: [],
    id: string,
    modified: string,
    needsReview: boolean,
    parentCurrency: Currency,
    parentCurrencyExchangeRate?: number,
    paymentType: { id: string, name: string },
    poi: any,
    timestamp: string,
    vendor: Vendor
}

export type ExpenseType = {
    id: string,
    icon: string,
    name: string
}

export type Vendor = {
    id: string,
    name: string,
    city: any
}