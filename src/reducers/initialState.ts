import moment from 'moment';
import _ from 'lodash';

export default {
  dashboard:{
    carLogs: [],
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
  pois:{
    pois: {count:0, items:[]}
  }
};
