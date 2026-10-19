import { test, expect } from './fixtures';
import { scenarios } from './scenarios';
import { expense, expenseType } from './data';

test.beforeEach(async ({ page, api }) => {
    api.useScenario(scenarios.expenses.map(mock => mock.resource === 'expensetype'
        ? { ...mock, body: [expenseType, { id: 'travel', name: 'Travel' }] }
        : mock));
    await page.goto('/expenses');
    await api.assertLoaded();
    await page.getByRole('button', { name: 'Expense actions', exact: true }).click();
    await page.getByRole('button', { name: 'Split', exact: true }).click();
});

test('opens independently, adds and removes rows, and resets cancelled drafts', async ({ page }) => {
    const dialog = page.getByRole('dialog', { name: 'Split expense', exact: true });
    await expect(page.getByRole('dialog')).toHaveCount(1);
    await expect(dialog.getByRole('spinbutton')).toHaveCount(2);
    await expect(dialog.getByRole('spinbutton').first()).toHaveValue('');
    await expect(dialog.getByRole('spinbutton').nth(1)).toHaveValue('');
    await expect(dialog.getByLabel('Type', { exact: true }).first()).toHaveValue('food');
    await expect(dialog.getByLabel('Comment').first()).toHaveValue(expense.comment);
    await expect(dialog.getByRole('button', { name: 'Remove item 2' })).toBeDisabled();
    await dialog.getByRole('button', { name: 'Add item' }).click();
    await expect(dialog.getByRole('spinbutton')).toHaveCount(3);
    await dialog.getByRole('button', { name: 'Remove item 2' }).click();
    await expect(dialog.getByRole('spinbutton')).toHaveCount(2);
    await expect(dialog.getByRole('button', { name: 'Remove item 2' })).toBeDisabled();
    await dialog.getByRole('spinbutton').first().fill('5');
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).toHaveCount(0);
    await page.getByRole('button', { name: 'Expense actions', exact: true }).click();
    await page.getByRole('button', { name: 'Split', exact: true }).click();
    await expect(dialog.getByRole('spinbutton').first()).toHaveValue('');
});

test('validates amounts and compares decimal totals exactly', async ({ page }) => {
    const dialog = page.getByRole('dialog');
    const amounts = dialog.getByRole('spinbutton');
    const save = dialog.getByRole('button', { name: 'Save', exact: true });
    await expect(save).toBeDisabled();
    await amounts.nth(1).fill('12.50');
    for (const invalid of ['0', '-1', '0.001', '1', '']) {
        await amounts.first().fill(invalid);
        await expect(save).toBeDisabled();
    }
    await amounts.first().fill('0.10');
    await amounts.nth(1).fill('12.40');
    await expect(save).toBeEnabled();
    await expect(dialog.getByText('Remaining: 0.00 EUR', { exact: true })).toBeVisible();
});

for (const viewport of [{ width: 390, height: 667 }, { width: 667, height: 375 }, { width: 1280, height: 600 }]) {
    test(`keeps split fields and actions accessible at ${viewport.width}x${viewport.height}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        const dialog = page.getByRole('dialog', { name: 'Split expense', exact: true });
        const save = dialog.getByRole('button', { name: 'Save', exact: true });
        const cancel = dialog.getByRole('button', { name: 'Cancel', exact: true });
        await expect(save).toBeInViewport({ ratio: 1 });
        await expect(cancel).toBeInViewport({ ratio: 1 });

        await dialog.getByRole('spinbutton').first().fill('5');
        await dialog.getByRole('button', { name: 'Add item' }).click();
        const lastComment = dialog.getByLabel('Comment').last();
        await lastComment.fill('Additional split item');
        await lastComment.evaluate(element => element.scrollIntoView({ block: 'center' }));
        await expect(lastComment).toBeInViewport({ ratio: 1 });
        await expect(save).toBeInViewport({ ratio: 1 });
        await expect(cancel).toBeInViewport({ ratio: 1 });

        await dialog.getByRole('spinbutton').first().scrollIntoViewIfNeeded();
        await expect(dialog.getByRole('spinbutton').first()).toBeInViewport({ ratio: 1 });
        await cancel.click();
        await expect(dialog).toHaveCount(0);
    });
}

test('sends retained and additional rows, prevents duplicate saves, and refreshes data', async ({ page }) => {
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Add item' }).click();
    const amounts = dialog.getByRole('spinbutton');
    await amounts.nth(0).fill('5.10');
    await amounts.nth(1).fill('7.20');
    await amounts.nth(2).fill('0.20');
    await dialog.getByLabel('Comment').nth(0).fill('Retained');
    await dialog.getByLabel('Type', { exact: true }).nth(1).selectOption('travel');
    await dialog.getByLabel('Comment').nth(1).fill('Transport');

    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    let requests = 0;
    await page.route('**/test-api/expense/expense-1/split', async route => {
        requests++;
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toEqual({
            amount: 5.10, expenseTypeId: 'food', comment: 'Retained',
            expenses: [
                { amount: 7.20, expenseTypeId: 'travel', comment: 'Transport' },
                { amount: 0.20, expenseTypeId: 'food', comment: expense.comment },
            ],
        });
        await gate;
        await route.fulfill({ status: 200, body: '' });
    });
    const refreshed = ['expense', 'expense/sum', 'expense/sum/bycurrency', 'expense/type/count', 'expense/vendor/count', 'expense/sum/bymonthofyear'];
    const refreshes = refreshed.map(resource => page.waitForResponse(response =>
        new URL(response.url()).pathname.toLowerCase() === `/test-api/${resource}` && response.request().method() === 'GET'));
    await dialog.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(dialog.getByRole('status', { name: 'Saving' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Save', exact: true })).toBeDisabled();
    await expect(amounts.first()).toBeDisabled();
    await expect(dialog.getByRole('button', { name: 'Add item' })).toBeDisabled();
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeVisible();
    await amounts.first().press('Enter');
    release();
    await expect(dialog).toHaveCount(0);
    await Promise.all(refreshes);
    expect(requests).toBe(1);
});

test('preserves the draft on failure and allows retry', async ({ page }) => {
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('spinbutton').first().fill('5');
    await dialog.getByRole('spinbutton').nth(1).fill('7.5');
    let requests = 0;
    await page.route('**/test-api/expense/expense-1/split', async route => {
        requests++;
        await route.fulfill({ status: requests === 1 ? 500 : 200, body: '' });
    });
    await dialog.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(dialog.getByRole('alert')).toHaveText('Could not split expense. Please try again.');
    await expect(dialog.getByRole('spinbutton').first()).toHaveValue('5');
    await expect(dialog.getByRole('spinbutton').nth(1)).toHaveValue('7.5');
    await dialog.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    expect(requests).toBe(2);
});

test('supports splitting negative expenses', async ({ page, api }) => {
    await page.getByRole('button', { name: 'Cancel' }).click();
    api.useScenario(scenarios.expenses.map(mock => mock.resource === 'expense'
        ? { ...mock, body: { count: 1, items: [{ ...expense, amount: -12.5 }] } }
        : mock));
    await page.reload();
    await api.assertLoaded();
    await page.getByRole('button', { name: 'Expense actions', exact: true }).click();
    await page.getByRole('button', { name: 'Split', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('spinbutton').first().fill('-5');
    await dialog.getByRole('spinbutton').nth(1).fill('-7.50');
    await expect(dialog.getByRole('button', { name: 'Save', exact: true })).toBeEnabled();
    await dialog.getByRole('spinbutton').first().fill('5');
    await expect(dialog.getByRole('button', { name: 'Save', exact: true })).toBeDisabled();
});
