import * as data from './data';
import type { components } from 'types/ivy-types';

export interface MockResponse {
    resource: string;
    body: unknown;
    query?: Record<string, string>;
    allowedQuery?: string[];
    minimumCalls?: number;
}

const filters = ['from', 'to', 'page', 'pagesize', 'pageall', 'orderascending', 'search'];
const get = (resource: string, body: unknown, allowedQuery = filters): MockResponse => ({ resource, body, allowedQuery });
const totals = [{ key: '2026-10-01', value: 12.5 }];
const currencies = get('currency', [data.currency]);
const countries = get('country', data.paged(data.country));
const expenses = get('expense', data.paged(data.expense));
const flights = get('flight', data.paged(data.flight));
const movies = get('movie', data.paged(data.movie), [...filters, 'ratinghigher', 'ratinglower', 'runtimelonger', 'runtimeshorter']);
const consumations = get('consumation', data.paged(data.consumation));
const lastLocation = get('tracking/lastlocation', data.lastLocation);
const trip = get(`trip/${data.trip.id}`, data.trip);
const car = get(`car/${data.car.id}`, data.car);
const locationOptions = get('location', data.paged({ id: 'location-1', name: 'Test Location' } satisfies components['schemas']['Location']));
const todoFilters = [...filters, 'iscompleted', 'fromduedate', 'toduedate'];

export const scenarios: Record<string, MockResponse[]> = {
    dashboard: [
        consumations, movies, lastLocation, expenses,
        get('user/weight', [{ key: data.date, value: 75 }]),
        { ...get(`car/${data.car.id}/log/latest`, { timestamp: data.tracking.timestamp, odometer: 42000 }), allowedQuery: ['hasodometer'], query: { hasodometer: 'true' } },
        ...['2026-10-03', '2026-09-28', '2026-10-01'].flatMap(from => [
            { ...get('expense/sum', 12.5), query: { from } },
            { ...get('tracking/distance', 10000), query: { from } },
        ]),
    ],
    accounts: [
        currencies, get('bank', data.paged(data.account.bank)),
        { ...get('account', data.paged(data.account), [...filters, 'isactive', 'bankids']), query: { isactive: 'true' } },
    ],
    beer: [
        consumations, countries, get('beer/brand', [data.beerBrand]), get('beer', data.paged(data.beer)),
        get('common/beerserving', [{ id: 'bottle', name: 'Bottle' }]),
        get('common/beerstyle', [data.beer.style]),
        get('consumation/beer/count', 1), get('consumation/brand/count', 1),
        get('consumation/sum', 500), get('consumation/sum/bybeer', data.paged({ key: data.beer, value: 500 })),
        get('consumation/beer/new', data.paged(data.beer)), get('consumation/sum/byserving', [{ key: { id: 'bottle', name: 'Bottle' }, value: 500 }]),
        get('consumation/sum/bycountry', data.paged({ key: data.country, value: 500 })),
        get('consumation/sum/byday', [{ key: data.date, value: 500 }]),
        get('consumation/count/bymonthofyear', [{ key: 10, value: 1 }]),
        get('consumation/sum/bymonthofyear', [{ key: 10, value: 500 }]),
    ],
    beerAdmin: [countries, get('beer/brand', [data.beerBrand]), get('beer', data.paged(data.beer)), get('common/beerstyle', [data.beer.style])],
    calendarYear: [get('workday', [{ date: '2026-10-01', type: 'remote' } satisfies components['schemas']['WorkDay']])],
    calendarMonth: [
        { ...get('calendar/days', data.calendar), query: { from: '2026-10-01', to: '2026-10-31' } },
        movies, flights, get('todo', data.paged(data.todo), todoFilters),
    ],
    calendarDay: [{ ...get('tracking', [data.tracking]), query: { from: '2026-10-02T22:00:00', to: '2026-10-03T22:00:00', orderascending: 'true' } }],
    calls: [get('call', data.paged(data.call), [...filters, 'number'])],
    car: [
        car, get(`car/${data.car.id}/log`, [{ timestamp: data.tracking.timestamp, odometer: 42000 }], ['hasodometer']),
        get(`carmodel/${data.car.model.id}/servicetype`, [data.car.services[0].serviceType]),
        get(`carmodel/${data.car.model.id}/serviceinterval`, []),
        get(`car/${data.car.id}/fuel/sum/byyear`, [{ key: 2026, value: 200 }]),
        get(`car/${data.car.id}/kilometers/byyear`, [{ key: 2026, value: 1000 }]),
        get(`car/${data.car.id}/consumption/avg`, 6),
    ],
    carTimeline: [car],
    expenses: [
        expenses, currencies, get('card', []), get('vendor', data.paged()), get('common/expensefiletype', []), get('common/paymenttype', [data.paymentType]),
        get('expensetype', [data.expenseType], [...filters, 'orderby']),
        get('expense/sum', 12.5), get('expense/sum/bycurrency', [{ key: data.currency, value: 12.5 }]),
        get('expense/type/count', 1), get('expense/vendor/count', 0),
        get('expense/sum/bymonthofyear', [{ key: 10, value: 12.5 }]),
    ],
    expenseTypes: [get('expensetype/tree', [{ this: data.expenseType, children: [] } satisfies components['schemas']['ExpenseTypeNode']])],
    flights: [flights, get('flight/count/byairline', [{ key: data.flight.airline, value: 1 }]), get('flight/count/byyear', [{ key: 2026, value: 1 }])],
    incomes: [
        currencies, get('income/source', [data.income.source]), get('common/incometype', [data.income.type]),
        get('income', data.paged(data.income)), get('income/sum', 2000), get('income/sum/bymonthofyear', [{ key: 10, value: 2000 }]),
    ],
    netWorth: [
        { ...get('expense/sum/bymonthofyear', totals, [...filters, 'targetcurrencyid']), query: { from: '2026-01-01', to: '2026-12-31', targetcurrencyid: 'EUR' } },
        { ...get('income/sum/bymonthofyear', [{ key: '2026-10-01', value: 2000 }], [...filters, 'targetcurrencyid']), query: { from: '2026-01-01', to: '2026-12-31', targetcurrencyid: 'EUR' } },
    ],
    inventory: [get('inventory/item', data.paged(data.inventoryItem))],
    movies: [movies, get('movie/count/byday', [{ key: data.date, value: 1 }], movies.allowedQuery), get('movie/count/byyear', [{ key: 2026, value: 1 }], movies.allowedQuery)],
    places: [countries],
    pois: [get('poi', data.paged(data.poi)), get('vendor', data.paged()), get('common/poicategory', [data.poi.category])],
    routes: [locationOptions],
    tracking: [lastLocation, locationOptions, get('route', data.paged()), get('geohash/root/children', []), get('location/types', [{ id: 'home', name: 'Home' }])],
    todo: [
        { ...get('todo', data.paged(data.todo), todoFilters), query: { iscompleted: 'false', page: '1', pagesize: '20' } },
        { ...get('todo', data.paged({ ...data.todo, id: 'todo-2', name: 'Completed Smoke Task', isCompleted: true }), todoFilters), query: { iscompleted: 'true', page: '1', pagesize: '20' } },
        get('todo/count/bytag', [], todoFilters), get('todo/count/bytrip', [], todoFilters),
    ],
    journal: [get('journal/entry', data.paged(data.journalEntry))],
    trips: [
        countries, get('city', data.paged(data.city)), get('trip', data.paged(data.trip)), get('trip/days/byyear', [{ key: 2026, value: 2 }]),
        get('country/visited', [data.country]), get('country/list/visited', []),
        ...[1, 2, 3, 4, 5, 6, 7].map(precision => ({ ...get('geohash/unique/count', 1, ['precision']), query: { precision: String(precision) } })),
    ],
    trip: [
        trip, expenses, get('city', data.paged(data.city)), get('consumation/sum', 500), flights,
        get('ride', []), get('tracking', [data.tracking]),
    ],
};
