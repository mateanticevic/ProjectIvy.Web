import { test, expect } from './fixtures';
import { scenarios } from './scenarios';
import { income, currency } from './data';

const salary = { id: 'salary-1', date: '2026-10-01', netTotal: 2100, currency, note: 'October payroll' };

test.beforeEach(async ({ page, api }) => {
    api.useScenario(scenarios.incomes);
    await page.route('**/test-api/income?**', route => route.fulfill({ json: {
        count: 1, items: [{ ...income, id: 'income-1', salary }]
    } }));
    await page.route('**/test-api/salary?**', route => route.fulfill({ json: {
        count: 6,
        items: Array.from({ length: 6 }, (_, index) => ({ ...salary, id: `salary-${index + 1}`, note: `Payroll ${index + 1}` }))
    } }));
});

test('filters incomes and totals by salary link and restores the selection from the URL', async ({ page, api }) => {
    api.useScenario(scenarios.incomes.map(response => ({
        ...response,
        allowedQuery: [...(response.allowedQuery ?? []), 'linkedtosalary'],
    })));
    await page.goto('/incomes?page=2&linkedToSalary=false');
    const toggle = page.getByRole('group', { name: 'Linked to salary', exact: true });
    await expect(toggle.getByRole('radio', { name: 'No', exact: true })).toBeChecked();

    const select = async (name: string, value: string | null) => {
        const requests = ['income', 'income/sum', 'income/sum/bymonthofyear'].map(resource =>
            page.waitForRequest(request => {
                const url = new URL(request.url());
                return url.pathname === `/test-api/${resource}` && url.searchParams.get('LinkedToSalary') === value;
            })
        );
        await toggle.getByText(name, { exact: true }).click();
        for (const request of await Promise.all(requests)) {
            expect(new URL(request.url()).searchParams.get('page')).toBe('1');
        }
        expect(new URL(page.url()).searchParams.get('linkedToSalary')).toBe(value);
        await expect(toggle.getByRole('radio', { name, exact: true })).toBeChecked();
    };

    await select('Yes', 'true');
    await select('No', 'false');
    await page.reload();
    await expect(toggle.getByRole('radio', { name: 'No', exact: true })).toBeChecked();
    await select('Both', null);
});

test('edits existing income, refreshes salary choices with date plus five days, and saves the link', async ({ page }) => {
    const bodies: unknown[] = [];
    await page.route('**/test-api/income/income-1', route => {
        expect(route.request().method()).toBe('PUT');
        bodies.push(route.request().postDataJSON());
        return bodies.length === 1 ? route.fulfill({ status: 500 }) : route.fulfill({ status: 204 });
    });
    await page.goto('/incomes');
    const initialSearch = page.waitForRequest(request => request.url().includes('/test-api/salary?'));
    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    expect(Object.fromEntries(new URL((await initialSearch).url()).searchParams)).toEqual({
        To: '2026-10-08', Page: '1', PageSize: '5', OrderAscending: 'false'
    });
    const dialog = page.getByRole('dialog', { name: 'Edit income' });
    await expect(dialog.getByLabel('Date', { exact: true })).toHaveValue('2026-10-03');
    await expect(dialog.getByLabel('Description')).toHaveValue(income.description);
    await expect(dialog.getByLabel('Amount')).toHaveValue('2000');
    await expect(dialog.getByLabel('Currency')).toHaveValue('EUR');
    await expect(dialog.getByLabel('Source')).toHaveValue('source-1');
    await expect(dialog.getByLabel('Type')).toHaveValue('salary');
    await expect(dialog.getByLabel('Salary', { exact: true })).toHaveValue('salary-1');
    await expect(dialog.getByLabel('Salary', { exact: true }).locator('option')).toHaveCount(6);
    const nextSearch = page.waitForRequest(request => request.url().includes('/test-api/salary?') && new URL(request.url()).searchParams.get('To') === '2026-11-03');
    await dialog.getByLabel('Date', { exact: true }).fill('2026-10-29');
    await nextSearch;
    await expect(dialog.getByLabel('Salary', { exact: true })).toBeEnabled();
    await dialog.getByLabel('Salary', { exact: true }).selectOption('salary-2');
    await dialog.getByLabel('Amount').fill('2200');
    await dialog.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(dialog.getByRole('alert')).toContainText('Your values have been kept');
    await expect(dialog.getByLabel('Amount')).toHaveValue('2200');
    await dialog.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(dialog).not.toBeVisible();
    expect(bodies).toHaveLength(2);
    expect(bodies[1]).toEqual({ date: '2026-10-29', amount: 2200, currencyId: 'EUR', sourceId: 'source-1', typeId: 'salary', description: income.description, salaryId: 'salary-2' });
});

test('clears an existing salary and resets fields when creating a new income', async ({ page }) => {
    let updated: Record<string, unknown> | undefined;
    let created: Record<string, unknown> | undefined;
    await page.route('**/test-api/income/income-1', route => {
        updated = route.request().postDataJSON();
        return route.fulfill({ status: 204 });
    });
    await page.route('**/test-api/income', route => {
        expect(route.request().method()).toBe('POST');
        created = route.request().postDataJSON();
        return route.fulfill({ status: 201 });
    });
    await page.goto('/incomes');
    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    let dialog = page.getByRole('dialog');
    await expect(dialog.getByLabel('Salary', { exact: true })).toBeEnabled();
    await dialog.getByLabel('Salary', { exact: true }).selectOption('');
    await dialog.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(dialog).not.toBeVisible();
    expect(updated?.salaryId).toBeNull();
    await page.getByRole('button', { name: 'New income' }).click();
    dialog = page.getByRole('dialog', { name: 'New income' });
    await expect(dialog.getByLabel('Description')).toHaveValue('');
    await expect(dialog.getByLabel('Amount')).toHaveValue('0');
    await expect(dialog.getByLabel('Currency')).toHaveValue('EUR');
    await expect(dialog.getByLabel('Date', { exact: true })).toHaveValue('2026-10-03');
    await expect(dialog.getByLabel('Salary', { exact: true })).toBeEnabled();
    await dialog.getByLabel('Salary', { exact: true }).selectOption('salary-3');
    await dialog.getByLabel('Amount').fill('500');
    await dialog.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(dialog).not.toBeVisible();
    expect(created).toMatchObject({ amount: 500, currencyId: 'EUR', date: '2026-10-03', salaryId: 'salary-3' });
});
