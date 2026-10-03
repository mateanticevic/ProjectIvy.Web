import type { components } from 'types/ivy-types';
import type { User } from 'types/users';
import type { Call } from 'types/calls';

type Schema = components['schemas'];

export const date = '2026-10-03';
export const currency = { id: 'EUR', code: 'EUR', name: 'Euro', symbol: '€' } satisfies Schema['Currency'];
export const country = { id: 'HR', name: 'Croatia' } satisfies Schema['Country'];
export const city = { id: 'zagreb', name: 'Zagreb', country, lat: 45.81, lng: 15.98, timeZone: 'Europe/Zagreb' } satisfies Schema['City'];
export const expenseType = { id: 'food', name: 'Food' } satisfies Schema['ExpenseType'];
export const paymentType = { id: 'cash', name: 'Cash' } satisfies Schema['PaymentType'];
export const expense = {
    id: 'expense-1', date, datePaid: date, amount: 12.5, comment: 'Smoke test lunch',
    currency, expenseType, paymentType, files: [],
} satisfies Schema['Expense'];
export const beerBrand = { id: 'brand-1', name: 'Test Brewery', country } satisfies Schema['BeerBrand'];
export const beer = {
    id: 'beer-1', name: 'Test Lager', brand: beerBrand, abv: 5,
    style: { id: 'lager', name: 'Lager' },
} satisfies Schema['Beer'];
export const consumation = { date, beer, serving: 'bottle', volume: 500 } satisfies Schema['Consumation'];
export const movie = {
    imdbId: 'tt0000001', title: 'Smoke Test Movie', timestamp: `${date}T18:00:00`,
    year: 2026, runtime: 100, rating: 7, myRating: 8,
} satisfies Schema['Movie'];
export const flight = {
    id: 'flight-1', number: 'OU123', airline: { id: 'OU', name: 'Test Airline' },
    origin: { iata: 'ZAG', name: 'Zagreb' }, destination: { iata: 'SPU', name: 'Split' },
    departure: `${date}T08:00:00Z`, arrival: `${date}T09:00:00Z`,
    departureLocal: `${date}T10:00:00`, arrivalLocal: `${date}T11:00:00`, distanceInKm: 250,
} satisfies Schema['Flight'];
export const car = {
    id: 'car-1', model: { id: 'model-1', name: 'Test Car' },
    services: [{
        id: 'service-1', date: `${date}T10:00:00`, description: 'Annual service',
        odometer: 42000, serviceType: { id: 'oil', name: 'Oil change' },
    }],
    serviceDue: [],
} satisfies Schema['Car'];
export const user = {
    username: 'smoke-user', email: 'smoke@example.test', firstName: 'Smoke', lastName: 'User',
    defaultCurrency: currency,
    defaultCar: { ...car, services: [] },
    trackingStartDate: '2026-01-01',
} satisfies User;
export const tracking = {
    timestamp: `${date}T10:00:00Z`, lat: 45.81, lng: 15.98, latitude: 45.81, longitude: 15.98,
} satisfies Schema['Tracking'];
export const lastLocation = { tracking, city, country } satisfies Schema['TrackingLocation'];
export const trip = {
    id: 'trip-1', name: 'Smoke Test Trip', timestampStart: `${date}T00:00:00`,
    timestampEnd: '2026-10-04T23:59:00', distance: 10000, totalSpent: 12.5,
    cities: [city], countries: [country], expenses: [expense], stays: [], pois: [], files: [],
} satisfies Schema['Trip'];
export const account = {
    id: 'account-1', name: 'Test Current Account', bank: { id: 'bank-1', name: 'Test Bank' },
    currency, active: true, balance: 100, balanceInDefaultCurrency: 100,
} satisfies Schema['Account'];
export const income = {
    timestamp: `${date}T10:00:00`, description: 'Smoke Test Salary', amount: 2000, currency,
    source: { id: 'source-1', name: 'Test Employer' }, type: { id: 'salary', name: 'Salary' },
} satisfies Schema['Income'];
export const call = {
    id: 'call-1', number: 123456, timestamp: `${date}T12:00:00`, duration: 60,
    file: { id: 'call-file-1' }, person: { id: 'person-1', firstName: 'Test', lastName: 'Caller' },
} satisfies Call;
export const poi = {
    id: 'poi-1', name: 'Test Cafe', category: { id: 'cafe', name: 'Cafe' },
    location: { latitude: 45.81, longitude: 15.98 }, address: 'Test street',
} satisfies Schema['Poi'];
export const todo = {
    id: 'todo-1', name: 'Smoke Test Task', created: `${date}T09:00:00`, dueDate: date,
    isCompleted: false, tags: [], trips: [],
} satisfies Schema['ToDo'];
export const journalEntry = { date, entry: 'Smoke test journal entry', created: `${date}T10:00:00`, modified: `${date}T10:00:00` } satisfies Schema['JournalEntry'];
export const inventoryItem = { id: 'inventory-1', name: 'Test Backpack', brand: { id: 'brand-1', name: 'Test Brand' } } satisfies Schema['InventoryItem'];
export const calendar = {
    days: Array.from({ length: 31 }, (_, index) => ({
        date: `2026-10-${String(index + 1).padStart(2, '0')}`,
        cities: [], countries: [], locations: [], events: [], externalEvents: [], timeline: [],
        workDayType: { id: 'remote', name: 'Remote' },
    })).reverse(),
} satisfies Schema['CalendarSection'];

export const paged = <T>(...items: T[]) => ({ count: items.length, items });
