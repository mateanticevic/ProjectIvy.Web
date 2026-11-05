import { test, expect } from './fixtures';
import { scenarios } from './scenarios';

test('shows yearly daily averages below Sum without date filters', async ({ page, api }) => {
    api.useScenario(scenarios.beer.map(response => ({
        ...response,
        allowedQuery: [...(response.allowedQuery ?? []), 'brandid'],
    })));
    const requests: URL[] = [];
    page.on('request', request => {
        const url = new URL(request.url());
        if (url.pathname === '/test-api/consumation/average/byyear') requests.push(url);
    });

    await page.goto('/beer?from=2026-01-01&to=2026-10-03&brandId=brand-1');
    await api.assertLoaded();
    const card = page.locator('.card').filter({ has: page.getByText('Average by year', { exact: true }) });
    await expect(card).toBeVisible();
    await expect(card.locator('.recharts-legend-wrapper')).toHaveText('mL/day');
    await expect(card.getByText('2025', { exact: true })).toBeVisible();
    await expect(card.getByText('2026', { exact: true })).toBeVisible();
    await expect(card.locator('xpath=preceding-sibling::*[1]').locator('.card-header')).toHaveText('Sum');

    const updatedAverage = page.waitForRequest(request => new URL(request.url()).pathname === '/test-api/consumation/average/byyear');
    await page.getByRole('button', { name: '< 2025', exact: true }).click();
    await updatedAverage;
    await expect(page).toHaveURL(/from=2025-01-01/);
    await expect(page).toHaveURL(/to=2025-12-31/);
    await expect(card.getByText('2026', { exact: true })).toBeVisible();
    expect(requests).toHaveLength(2);
    for (const url of requests) {
        const query = new URLSearchParams([...url.searchParams].map(([key, value]) => [key.toLowerCase(), value]));
        expect(query.has('from')).toBe(false);
        expect(query.has('to')).toBe(false);
        expect(query.get('brandid')).toBe('brand-1');
    }
});
