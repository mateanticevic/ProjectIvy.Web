export default {
  expenses: {
    cards: [],
    counter: 1,
    expense: {
      currencyId: "HRK"
    },
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
  common:{
    currencies: [],
    expenseTypes: [],
    paymentTypes: [],
    poiCategories: [],
    vendors: []
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
      expenses: [],
      pois: []
    },
    trackings: []
  }
};
