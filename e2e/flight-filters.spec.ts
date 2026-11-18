import { expect, test } from './fixtures';
import { flight, paged } from './data';
import type { MockResponse } from './scenarios';

test('refreshes flights and charts on filter changes and restarts pagination', async ({ page, api }) => {
    await page.setViewportSize({ width: 800, height: 1000 });
    const initialQuery = { page: '1', pagesize: '10', orderascending: 'false' };
    const originFilter = { originid: 'ZAG' };
    const routeFilter = { ...originFilter, destinationid: 'SPU' };
    const fromFilter = { ...routeFilter, from: '2026-10-03' };
    const filters = { ...fromFilter, to: '2026-10-04' };
    const filterSteps = [originFilter, routeFilter, fromFilter, filters];
    const filteredQuery = { ...initialQuery, ...filters, orderascending: 'true' };
    const chartQuery = { pageall: 'true' };
    const olderFlight = { ...flight, id: 'flight-2', origin: flight.destination, destination: flight.origin };
    const match = (resource: string, query: Record<string, string>, body: unknown): MockResponse =>
        ({ resource, query, allowedQuery: Object.keys(query), body });

    api.useScenario([
        match('flight', initialQuery, { count: 11, items: [flight] }),
        match('flight', { ...initialQuery, page: '2' }, paged(olderFlight)),
        ...filterSteps.flatMap(step => [
            match('flight', { ...initialQuery, ...step }, paged()),
            match('flight/count/byairline', { ...chartQuery, ...step }, []),
            match('flight/count/byyear', { ...chartQuery, ...step }, []),
        ]),
        match('flight', filteredQuery, paged()),
        match('airport', { search: 'Zag', pagesize: '5' }, paged(flight.origin)),
        match('airport', { search: 'Spl', pagesize: '5' }, paged(flight.destination)),
        match('flight/count/byairline', chartQuery, [{ key: flight.airline, value: 1 }]),
        match('flight/count/byyear', chartQuery, [{ key: 2026, value: 1 }]),
    ]);

    await page.goto('/flights');
    await expect(page.getByText('ZAG - SPU')).toBeVisible();
    await page.getByRole('button', { name: 'Load More' }).click();
    await expect(page.getByText('SPU - ZAG')).toBeVisible();

    await page.getByRole('combobox', { name: 'Origin' }).fill('Zag');
    await page.getByRole('option', { name: 'Zagreb (ZAG)' }).click();
    await page.getByRole('combobox', { name: 'Destination' }).fill('Spl');
    await page.getByRole('option', { name: 'Split (SPU)' }).click();
    const fromDate = page.getByLabel('From date');
    await fromDate.fill('2026-10-03');
    await fromDate.press('Tab');
    const throughDate = page.getByLabel('Through date');
    await throughDate.fill('2026-10-03');
    await throughDate.press('Tab');
    await page.getByLabel('Sort by departure').selectOption('true');
    await expect(page.getByRole('button', { name: 'Apply filters' })).toHaveCount(0);

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
