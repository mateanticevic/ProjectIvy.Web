import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { currency } from './data';
import type { components } from '../src/types/ivy-types';

type Salary = components['schemas']['Salary'];
const company = { id: 'company-1', name: 'Example company' };
const otherCompany = { id: 'company-2', name: 'Other company' };
const salary: Salary = {
    id: 'salary-1', date: '2026-10-01T00:00:00', currency, company,
    gross: 3000, grossTotal: 3500, net: 2000, netTotal: 2100,
    medical: 200, tax: 300, travelExpenses: 100, deductions: null, note: 'October payroll'
};

async function install(page: Page) {
    await page.route('**/test-api/company?**', route => {
        expect(new URL(route.request().url()).searchParams.get('PageAll')).toBe('true');
        return route.fulfill({ json: { items: [company, otherCompany], count: 2 } });
    });
    await page.route('**/test-api/currency', route => route.fulfill({ json: [currency] }));
    await page.route('**/test-api/salary?**', route => route.fulfill({ json: { items: [salary], count: 1 } }));
}

test.beforeEach(async ({ page }) => install(page));

for (const width of [390, 1440]) {
    test(`salary table and form fit at ${width}px`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 900 });
        if (width === 390) await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
        await page.goto('/salary');
        const table = page.getByRole('table', { name: 'Salaries' });
        await expect(table.getByRole('row')).toHaveCount(2);
        await expect(table).toContainText('1 Oct 2026');
        await expect(table).toContainText('EUR');
        await expect(table).toContainText('3.000,00');
        await expect(table.getByRole('columnheader', { name: 'Gross', exact: true })).toBeVisible();
        await expect(table.getByRole('columnheader', { name: 'Gross total', exact: true })).toBeVisible();
        await expect(table.getByRole('row').nth(1).getByRole('cell').nth(3)).toHaveText('3.500,00');
        await expect(page.locator('html')).toHaveAttribute('data-bs-theme', width === 390 ? 'dark' : 'light');
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        if (width === 390) {
            expect(await table.locator('..').evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
            await page.getByRole('button', { name: 'Toggle navigation' }).click();
        }
        const finance = page.getByRole('region', { name: 'Finance', exact: true });
        await expect(finance.getByRole('link')).toHaveText(['Accounts', 'Expenses', 'Incomes', 'Salary', 'Net worth']);
        await expect(finance.getByRole('link', { name: 'Salary', exact: true })).toHaveAttribute('aria-current', 'page');
        await finance.getByRole('link', { name: 'Salary', exact: true }).click();
        await page.getByRole('button', { name: 'Add salary', exact: true }).click();
        const dialog = page.getByRole('dialog', { name: 'Add salary', exact: true });
        await expect(dialog.getByLabel('Date', { exact: true })).toHaveValue('2026-10-03');
        await expect(dialog.getByLabel('Currency', { exact: true })).toHaveValue('EUR');
        await expect(dialog.getByRole('spinbutton')).toHaveCount(8);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        await page.screenshot({ path: testInfo.outputPath('salary-form.png'), fullPage: true, animations: 'disabled' });
    });
}

test('persists filters and pagination and restores them through browser navigation', async ({ page }) => {
    const queries: URLSearchParams[] = [];
    await page.route('**/test-api/salary?**', route => {
        const query = new URL(route.request().url()).searchParams;
        queries.push(query);
        return route.fulfill({ json: { items: [salary], count: 26 } });
    });
    await page.goto('/salary');
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.locator('.rdt input')).toHaveCount(2);
    expect(Object.fromEntries(queries[0])).toEqual({ Page: '1', PageSize: '25', OrderAscending: 'false' });
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page.getByText('Page 2 of 2 · 26 salaries')).toBeVisible();
    await page.getByLabel('From', { exact: true }).fill('2026-01-01');
    await expect(page).toHaveURL(/from=2026-01-01$/);
    await page.getByLabel('To', { exact: true }).fill('2026-12-31');
    await page.getByLabel('Currency', { exact: true }).selectOption('EUR');
    await page.getByLabel('Company', { exact: true }).selectOption(company.id);
    await expect.poll(() => Object.fromEntries(queries.at(-1)!)).toEqual({
        Page: '1', PageSize: '25', OrderAscending: 'false', From: '2026-01-01', To: '2026-12-31', CurrencyId: 'EUR', CompanyId: company.id
    });
    await page.reload();
    await expect(page.getByLabel('From', { exact: true })).toHaveValue('2026-01-01');
    await expect(page.getByLabel('To', { exact: true })).toHaveValue('2026-12-31');
    await expect(page.getByLabel('Currency', { exact: true })).toHaveValue('EUR');
    await expect(page.getByLabel('Company', { exact: true })).toHaveValue(company.id);
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByText('Page 2 of 2 · 26 salaries')).toBeVisible();
    await page.goBack();
    await expect(page.getByText('Page 1 of 2 · 26 salaries')).toBeVisible();
});

test('creates once, validates required values, and converts blank amounts', async ({ page }) => {
    const bodies: unknown[] = [];
    let listCalls = 0;
    await page.route('**/test-api/salary?**', route => {
        listCalls++;
        return route.fulfill({ json: { items: [salary], count: 1 } });
    });
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/test-api/salary', async route => {
        bodies.push(route.request().postDataJSON());
        await gate;
        await route.fulfill({ status: 201, json: salary });
    });
    await page.goto('/salary');
    await page.getByRole('button', { name: 'Add salary', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Add salary', exact: true });
    await expect(dialog.locator('.rdt input')).toHaveAttribute('id', 'salary-date');
    await dialog.getByLabel('Company', { exact: true }).selectOption(company.id);
    await dialog.getByLabel('Date', { exact: true }).fill('invalid date');
    await dialog.getByRole('button', { name: 'Save salary' }).click();
    await expect(dialog.getByRole('alert')).toContainText('Choose a valid date and currency.');
    expect(bodies).toEqual([]);
    await dialog.getByLabel('Date', { exact: true }).fill('');
    await dialog.getByRole('button', { name: 'Save salary' }).click();
    expect(bodies).toEqual([]);
    await dialog.getByLabel('Date', { exact: true }).fill('2026-10-03');
    await dialog.getByLabel('Currency', { exact: true }).selectOption('');
    await dialog.getByRole('button', { name: 'Save salary' }).click();
    expect(bodies).toEqual([]);
    await dialog.getByLabel('Currency', { exact: true }).selectOption('EUR');
    await dialog.getByLabel('Company', { exact: true }).selectOption('');
    await dialog.getByRole('button', { name: 'Save salary' }).click();
    expect(bodies).toEqual([]);
    await dialog.getByLabel('Company', { exact: true }).selectOption(company.id);
    await dialog.getByLabel('Net', { exact: true }).fill('1234.56');
    await dialog.getByLabel('Note', { exact: true }).fill('New payroll');
    await dialog.getByRole('button', { name: 'Save salary' }).click();
    await expect(dialog.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(bodies).toEqual([{
        date: '2026-10-03', currencyId: 'EUR', companyId: company.id, note: 'New payroll',
        gross: 0, grossTotal: 0, net: 1234.56, netTotal: 0, medical: 0, tax: 0, travelExpenses: 0, deductions: null
    }]);
    release();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByText('Salary saved.', { exact: true })).toBeVisible();
    await expect.poll(() => listCalls).toBe(2);
    await expect(page.getByRole('table')).toBeVisible();
});

test('loads full details before editing and retains values after a failed save', async ({ page }) => {
    let detailCalls = 0;
    const bodies: Record<string, unknown>[] = [];
    await page.route('**/test-api/salary/salary-1', route => {
        if (route.request().method() === 'GET') {
            detailCalls++;
            return route.fulfill({ json: { ...salary, note: 'Full details' } });
        }
        bodies.push(route.request().postDataJSON());
        return bodies.length === 1 ? route.fulfill({ status: 500 }) : route.fulfill({ status: 204 });
    });
    await page.goto('/salary');
    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Edit salary', exact: true });
    await expect(dialog.getByLabel('Note', { exact: true })).toHaveValue('Full details');
    expect(detailCalls).toBe(1);
    for (const [label, value] of [['Gross', '3000'], ['Gross total', '3500'], ['Net', '2000'], ['Net total', '2100'], ['Medical', '200'], ['Tax', '300'], ['Travel expenses', '100'], ['Deductions', '']]) {
        await expect(dialog.getByLabel(label, { exact: true })).toHaveValue(value);
    }
    await expect(dialog.getByLabel('Company', { exact: true })).toHaveValue(company.id);
    await dialog.getByLabel('Company', { exact: true }).selectOption(otherCompany.id);
    await dialog.getByLabel('Deductions', { exact: true }).fill('50.25');
    await dialog.getByRole('button', { name: 'Save salary' }).click();
    await expect(dialog.getByRole('alert')).toContainText('Your values have been kept');
    await expect(dialog.getByLabel('Deductions', { exact: true })).toHaveValue('50.25');
    await dialog.getByRole('button', { name: 'Save salary' }).click();
    await expect(dialog).not.toBeVisible();
    expect(bodies).toHaveLength(2);
    expect(bodies[1]).toMatchObject({ currencyId: 'EUR', companyId: otherCompany.id, date: '2026-10-01', grossTotal: 3500, deductions: 50.25, note: 'Full details' });
});

test('confirms deletion, recovers from failure, and moves off an empty last page', async ({ page }) => {
    let deleted = false;
    let deleteCalls = 0;
    await page.route('**/test-api/salary?**', route => route.fulfill({ json: { items: [salary], count: deleted ? 25 : 26 } }));
    await page.route('**/test-api/salary/salary-1', route => {
        deleteCalls++;
        if (deleteCalls === 1) return route.fulfill({ status: 500 });
        deleted = true;
        return route.fulfill({ status: 204 });
    });
    await page.goto('/salary?page=2');
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Delete salary', exact: true });
    await expect(dialog).toContainText('1 Oct 2026 with net total 2100 EUR');
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(dialog).not.toBeVisible();
    expect(deleteCalls).toBe(0);
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await dialog.getByRole('button', { name: 'Delete salary', exact: true }).click();
    await expect(dialog.getByRole('alert')).toContainText('Could not delete salary');
    await dialog.getByRole('button', { name: 'Delete salary', exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page).toHaveURL(/page=1/);
    await expect(page.getByText('Page 1 of 1 · 25 salaries')).toBeVisible();
    expect(deleteCalls).toBe(2);
});

test('retries list, currency, and detail failures and shows empty and invalid-range states', async ({ page }) => {
    let listCalls = 0;
    let currencyCalls = 0;
    let detailCalls = 0;
    await page.route('**/test-api/salary?**', route => {
        listCalls++;
        return listCalls === 1 ? route.fulfill({ status: 500 }) : route.fulfill({ json: { items: listCalls === 2 ? [salary] : [], count: listCalls === 2 ? 1 : 0 } });
    });
    await page.route('**/test-api/currency', route => {
        currencyCalls++;
        return currencyCalls === 1 ? route.fulfill({ status: 500 }) : route.fulfill({ json: [currency] });
    });
    await page.route('**/test-api/salary/salary-1', route => {
        detailCalls++;
        return detailCalls === 1 ? route.fulfill({ status: 500 }) : route.fulfill({ json: salary });
    });
    await page.goto('/salary');
    await page.getByRole('button', { name: 'Retry salaries' }).click();
    await page.getByRole('button', { name: 'Retry currencies' }).click();
    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    await expect(page.getByText('Could not load salary details.', { exact: false })).toBeVisible();
    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
    await page.getByLabel('From', { exact: true }).fill('2026-12-31');
    await expect(page.getByText('No salaries found.')).toBeVisible();
    await page.getByLabel('To', { exact: true }).fill('2026-01-01');
    await expect(page.getByText('From must be on or before To.')).toBeVisible();
});


test('shows full amounts with all returned decimal places', async ({ page }) => {
    await page.route('**/test-api/salary?**', route => route.fulfill({ json: {
        items: [{ ...salary, gross: 1234567.89123, net: -12345.67, netTotal: 0 }], count: 1
    } }));
    await page.goto('/salary');
    const cells = page.getByRole('table').getByRole('row').nth(1).getByRole('cell');
    await expect(cells.nth(2)).toHaveText('1.234.567,89123');
    await expect(cells.nth(3)).toHaveText('3.500,00');
    await expect(cells.nth(4)).toHaveText('−12.345,67');
    await expect(cells.nth(5)).toHaveText('0,00');
});

test('ignores an older list response after filters change', async ({ page }) => {
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    let started = false;
    await page.route('**/test-api/salary?**', async route => {
        const from = new URL(route.request().url()).searchParams.get('From');
        if (!from) {
            started = true;
            await gate;
        }
        await route.fulfill({ json: { items: from ? [{ ...salary, gross: 999 }] : [salary], count: 1 } });
    });
    await page.goto('/salary');
    await expect.poll(() => started).toBe(true);
    await expect(page.getByRole('status')).toContainText('Loading salaries');
    await page.getByLabel('From', { exact: true }).fill('2026-01-01');
    const gross = page.getByRole('table', { name: 'Salaries' }).getByRole('row').nth(1).getByRole('cell').nth(2);
    await expect(gross).toHaveText('999,00');
    const oldResponse = page.waitForResponse(response => response.url().includes('/test-api/salary?') && !new URL(response.url()).searchParams.has('From'));
    release();
    await oldResponse;
    await expect(gross).toHaveText('999,00');
});


test('retries company loading before enabling salary changes', async ({ page }) => {
    let calls = 0;
    await page.route('**/test-api/company?**', route => {
        calls++;
        return calls === 1 ? route.fulfill({ status: 500 }) : route.fulfill({ json: { items: [company], count: 1 } });
    });
    await page.goto('/salary');
    await expect(page.getByRole('button', { name: 'Add salary', exact: true })).toBeDisabled();
    await page.getByRole('button', { name: 'Retry companies' }).click();
    await page.getByRole('button', { name: 'Add salary', exact: true }).click();
    await expect(page.getByRole('dialog').getByLabel('Company', { exact: true }).getByRole('option', { name: company.name, exact: true })).toHaveCount(1);
});
