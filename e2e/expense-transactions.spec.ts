import { test, expect } from './fixtures';
import { scenarios } from './scenarios';
import { currency } from './data';

const transaction = (id: string, created: string, amount: number) => ({
    id, created, amount, description: id, account: { name: 'Test account', currency },
});

test('groups exact matches first and ranks nearby transactions within the full date window', async ({ page, api }) => {
    api.useScenario(scenarios.expenses);
    await page.route('**/test-api/transaction?*', route => {
        const query = new URL(route.request().url()).searchParams;
        expect(query.get('From')).toBe('2026-09-30');
        expect(query.get('To')).toBe('2026-10-06');
        expect(query.get('PageAll')).toBe('true');
        return route.fulfill({ json: { items: [
            transaction('far-amount', '2026-10-03T12:00:00', -30),
            transaction('plus-three', '2026-10-06T23:00:00', -12.5),
            transaction('exact', '2026-10-03T12:00:00', -12.5),
            transaction('minus-three', '2026-09-30T12:00:00', -12.5),
            transaction('outside', '2026-10-07T12:00:00', -12.5),
        ] } });
    });
    await page.goto('/expenses');
    await api.assertLoaded();
    await page.getByText('Smoke test lunch', { exact: true }).click();
    await page.getByRole('tab', { name: 'Transactions', exact: true }).click();
    const select = page.getByRole('combobox', { name: 'Transaction', exact: true });
    await expect(select).toBeEnabled();
    await select.click();
    await expect(page.getByText('Exact matches', { exact: true })).toBeVisible();
    await expect(page.getByText('Others', { exact: true })).toBeVisible();
    const options = page.getByRole('option');
    await expect(options).toHaveCount(4);
    await expect(options.nth(0)).toContainText('exact');
    await expect(options.nth(1)).toContainText('plus-three');
    await expect(options.nth(2)).toContainText('minus-three');
    await expect(options.nth(3)).toContainText('far-amount');
    await options.first().click();
    await expect(page.getByText('Exact matches', { exact: true })).toHaveCount(0);
});

test('allows retrying a failed transaction lookup', async ({ page, api }) => {
    api.useScenario(scenarios.expenses);
    let fail = true;
    await page.route('**/test-api/transaction?*', route => route.fulfill(fail
        ? { status: 500, json: {} } : { json: { items: [] } }));
    await page.goto('/expenses');
    await api.assertLoaded();
    await page.getByText('Smoke test lunch', { exact: true }).click();
    await page.getByRole('tab', { name: 'Transactions', exact: true }).click();
    await expect(page.getByText('Could not load transactions.')).toBeVisible();
    fail = false;
    await page.getByRole('button', { name: 'Retry transactions' }).click();
    const select = page.getByRole('combobox', { name: 'Transaction', exact: true });
    await expect(select).toBeEnabled();
    await select.click();
    await expect(page.getByText('No transactions found', { exact: true })).toBeVisible();
});
