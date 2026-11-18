import { expect, test } from './fixtures';
import { flight, paged } from './data';
import type { MockResponse } from './scenarios';

test('applies flight filters to the list and charts and restarts pagination', async ({ page, api }) => {
    await page.setViewportSize({ width: 800, height: 1000 });
    const initialQuery = { page: '1', pagesize: '10', orderascending: 'false' };
    const filters = { originid: 'ZAG', destinationid: 'SPU', from: '2026-10-03', to: '2026-10-04' };
    const filteredQuery = { ...initialQuery, ...filters, orderascending: 'true' };
    const chartQuery = { pageall: 'true' };
    const olderFlight = { ...flight, id: 'flight-2', origin: flight.destination, destination: flight.origin };
    const match = (resource: string, query: Record<string, string>, body: unknown): MockResponse =>
        ({ resource, query, allowedQuery: Object.keys(query), body });

    api.useScenario([
        match('flight', initialQuery, { count: 11, items: [flight] }),
        match('flight', { ...initialQuery, page: '2' }, paged(olderFlight)),
        match('flight', filteredQuery, paged()),
        match('airport', { search: 'Zag', pagesize: '5' }, paged(flight.origin)),
        match('airport', { search: 'Spl', pagesize: '5' }, paged(flight.destination)),
        match('flight/count/byairline', chartQuery, [{ key: flight.airline, value: 1 }]),
        match('flight/count/byairline', { ...chartQuery, ...filters }, []),
        match('flight/count/byyear', chartQuery, [{ key: 2026, value: 1 }]),
        match('flight/count/byyear', { ...chartQuery, ...filters }, []),
    ]);

    await page.goto('/flights');
    await expect(page.getByText('ZAG - SPU')).toBeVisible();
    await page.getByRole('button', { name: 'Load More' }).click();
    await expect(page.getByText('SPU - ZAG')).toBeVisible();

    await page.getByRole('combobox', { name: 'Origin' }).fill('Zag');
    await page.getByRole('option', { name: 'Zagreb (ZAG)' }).click();
    await page.getByRole('combobox', { name: 'Destination' }).fill('Spl');
    await page.getByRole('option', { name: 'Split (SPU)' }).click();
    await page.getByLabel('From date').fill('2026-10-03');
    await page.getByLabel('Through date').fill('2026-10-03');
    await page.getByLabel('Sort by departure').selectOption('true');
    await page.getByRole('button', { name: 'Apply filters' }).click();

    await expect(page.getByText('No flights found.')).toBeVisible();
    await expect(page.getByText('SPU - ZAG')).toHaveCount(0);
    await api.assertLoaded();

    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    await expect(page.getByText('ZAG - SPU')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Load More' })).toBeVisible();
    await expect(page.getByLabel('From date')).toHaveValue('');
    await expect(page.getByLabel('Through date')).toHaveValue('');
    await expect(page.getByLabel('Sort by departure')).toHaveValue('false');
});
