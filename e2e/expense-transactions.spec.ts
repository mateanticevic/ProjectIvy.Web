import { test, expect } from './fixtures';
import { scenarios } from './scenarios';
import { currency, expense, paged } from './data';

const transaction = (id: string, created: string, amount: number) => ({
    id, created, amount, description: id, account: { name: 'Test account', currency },
});

test('groups exact matches, same-date transactions, and other nearby transactions', async ({ page, api }) => {
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
    await expect(page.getByText('Same date', { exact: true })).toBeVisible();
    await expect(page.getByText('Others', { exact: true })).toBeVisible();
    const options = page.getByRole('option');
    await expect(options).toHaveCount(4);
    await expect(options.nth(0)).toContainText('exact');
    await expect(options.nth(1)).toContainText('far-amount');
    await expect(options.nth(2)).toContainText('plus-three');
    await expect(options.nth(3)).toContainText('minus-three');
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
    await expect(page.getByText('No transactions to link', { exact: true })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Transaction', exact: true })).toHaveCount(0);
});

test('shows linked transactions and saves additional links', async ({ page, api }) => {
    const linked = { id: 'older-charge', created: '2026-09-21T12:00:00', amount: -5, description: 'Older charge' };
    const nearby = transaction('nearby-charge', '2026-10-03T12:00:00', -7.5);
    let savedExpense = { ...expense, transactions: [linked] };
    api.useScenario(scenarios.expenses.filter(mock => mock.resource !== 'expense'));
    await page.route('**/test-api/expense?*', route => route.fulfill({ json: paged(savedExpense) }));
    await page.route('**/test-api/transaction?*', route => route.fulfill({ json: paged(nearby) }));
    await page.route('**/test-api/expense/expense-1', route => {
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON().transactionIds).toEqual([linked.id, nearby.id]);
        savedExpense = { ...savedExpense, transactions: [linked, nearby] };
        return route.fulfill({ json: true });
    });

    await page.goto('/expenses');
    await api.assertLoaded();
    await page.getByText(expense.comment, { exact: true }).click();
    const dialog = page.getByRole('dialog');
    const tab = dialog.getByRole('tab', { name: 'Transactions', exact: true });
    await tab.click();
    await expect(dialog.getByText(/Older charge/)).toBeVisible();
    await dialog.getByRole('combobox', { name: 'Transaction', exact: true }).click();
    await dialog.getByRole('option', { name: /nearby-charge/ }).click();
    await expect(dialog.getByText('No transactions to link', { exact: true })).toBeVisible();
    await expect(dialog.getByRole('combobox', { name: 'Transaction', exact: true })).toHaveCount(0);
    await dialog.getByRole('tab', { name: 'General' }).click();
    await tab.click();
    await expect(dialog.getByText(/nearby-charge/)).toBeVisible();
    const refreshed = page.waitForResponse(response => new URL(response.url()).pathname === '/test-api/expense');
    await dialog.getByRole('button', { name: 'Save', exact: true }).click();
    await refreshed;
    await expect(dialog).toBeHidden();

    await page.getByText(expense.comment, { exact: true }).click();
    await tab.click();
    await expect(dialog.getByText(/Older charge/)).toBeVisible();
    await expect(dialog.getByText(/nearby-charge/)).toBeVisible();
});
