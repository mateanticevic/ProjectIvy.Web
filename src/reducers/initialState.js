import moment from 'moment'

export default {
  expenses: {
    cards: [],
    files: [],
    expense: {
      currencyId: "HRK",
      files: [],
      parentCurrencyId: null,
      paymentTypeId: "cash"
    },
    expenses: {
      count:0,
      items:[]
    },
    filters: {
      from: moment(new Date(new Date().getFullYear(), 0, 1)).format("YYYY-MM-DD"),
      pageSize: 10,
      page: 1
    },
    isModalOpen: false,
    orderBy: [
      { id: "date", name: "Date"},
      { id: "amount", name: "Amount"}
    ],
    stats: {
      sum: null
    },
    vendorPois: []
  },
  login: {
    credentials: {
      username: "",
      password: ""
    }
  },
  common:{
    currencies: [],
    expenseTypes: [],
    expenseFileTypes: [],
    paymentTypes: [],
    poiCategories: [],
    vendors: [],
    order: [
      { id: "false", name: "Descending" },
      { id: "true", name: "Ascending" }
    ]
  },
  pois:{
    pois: {count:0, items:[]}
  },
  trips: {
    countries: [],
    filters: { pageSize: 10, page: 1 },
    isModalOpen: false,
    trips: {count:0, items:[]}
  },
  trip: {
    trip: {
      cities: [],
      countries: [],
      expenses: [],
      pois: []
    },
    trackings: []
  }
};
