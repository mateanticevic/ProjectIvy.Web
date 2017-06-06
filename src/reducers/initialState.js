export default {
  expenses: {
    counter: 1,
    currencies: [],
    expense: { currencyValueId: null },
    expenses: {count:0, items:[]},
    expenseTypes: [],
    filters: { pageSize: 10, page:0 },
    isModalOpen: false,
    vendors: []
  },
  login: {
    credentials: {
      username: "",
      password: ""
    }
  },
  trips: {
    filters: { pageSize: 10, page:0 },
    isModalOpen: false,
    trips: {count:0, items:[]}
  }
};
