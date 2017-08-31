export default {
  expenses: {
    cards: [],
    counter: 1,
    expense: { currencyValueId: null },
    expenses: {count:0, items:[]},
    filters: { pageSize: 10, page: 1 },
    isModalOpen: false,
    vendorPois: []
  },
  login: {
    credentials: {
      username: "",
      password: ""
    }
  },
  registers:{
    currencies: [],
    expenseTypes: [],
    paymentTypes: [],
    vendors: []
  },
  trips: {
    countries: [],
    filters: { pageSize: 10, page: 1 },
    isModalOpen: false,
    trips: {count:0, items:[]}
  },
  trip: {
    trip: {
      pois: []
    },
    trackings: []
  }
};
