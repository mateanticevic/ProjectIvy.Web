import moment from 'moment';

export default {
  dashboard:{
    carLogLatest: { odometer: 0, timestamp: moment() },
    expenses: [],
    spentToday: 0,
    spentThisWeek: 0,
    spentThisMonth: 0,
    distance: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0
    },
    onlineGraphData: [],
    spentByMonthGraphData: [],
    movies: [],
    lastLocation: { lat: 0, lng: 0, timestamp: moment() },
    consumations: []
  },
  expenses: {
    cards: [],
    graphs: {
      count: [],
      sum: []
    },
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
      from: moment().month(0).date(1).format("YYYY-MM-DD"), // YYYY-01-01
      pageSize: 10,
      page: 1
    },
    isModalOpen: false,
    orderBy: [
      { id: "date", name: "Date"},
      { id: "created", name: "Created"},
      { id: "modified", name: "Modified"},
      { id: "amount", name: "Amount"}
    ],
    stats: {
      sum: null,
      types: null,
      vendors: null
    },
    vendorPois: []
  },
  flights:{
    countByAirport: [],
    flights: { count: 0, items: []}
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
