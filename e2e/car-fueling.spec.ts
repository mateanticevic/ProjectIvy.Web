import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { car } from './data';
import { scenarios, type MockResponse } from './scenarios';

const history = [
    { date: '2025-01-03', amountInLiters: 40 },
    { date: '2026-10-03', amountInLiters: 50 },
    { date: '2026-01-03', amountInLiters: 60 },
];
const yearly = [{ key: 2025, value: 40 }, { key: 2026, value: 110 }];
const monthly = [{ key: 10, value: 50 }, { key: 1, value: 100 }];
const mocks: MockResponse[] = [
    { resource: 'car/car-1', body: car, allowedQuery: [] },
    { resource: 'car/car-1/fuel', body: history, allowedQuery: [] },
    { resource: 'car/car-1/fuel/sum/byyear', body: yearly, allowedQuery: [] },
    { resource: 'car/car-1/fuel/sum/bymonth', body: monthly, allowedQuery: [] },
];

test.beforeEach(({ api }) => api.useScenario(mocks));

async function expectBar(page: Page, index: number, label: string, volume: string) {
    await page.locator('.recharts-bar-rectangle').nth(index).hover();
    const tooltip = page.locator('.recharts-tooltip-wrapper');
    await expect(tooltip).toContainText(label);
    await expect(tooltip).toContainText(volume);
}

test('defaults to yearly totals and switches to the API calendar-month totals', async ({ page, api }, testInfo) => {
    await page.goto('/car/car-1/fueling');
    await api.assertLoaded();
    await expect(page.getByRole('heading', { name: 'Car Fueling', exact: true })).toBeVisible();
    await expect(page.getByText('Test Car', { exact: true })).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Yearly', exact: true })).toBeChecked();
    await expect(page.locator('.recharts-bar-rectangle')).toHaveCount(2);
    await expectBar(page, 0, '2025', '40,00 L');
    await expectBar(page, 1, '2026', '110,00 L');
    await expect(page.locator('.recharts-yAxis-tick-labels')).toContainText('0,00 L');
    const rows = page.getByRole('table', { name: 'Fueling history' }).getByRole('row');
    await expect(rows).toHaveText(['DateFuel volume', '3 Oct 202650,00 L', '3 Jan 202660,00 L', '3 Jan 202540,00 L']);
    await page.locator('label[for="fueling-month"]').click();
    await expectBar(page, 0, 'January', '100,00 L');
    await expectBar(page, 1, 'October', '50,00 L');
    await expect(page.getByRole('table')).toHaveCount(1);
    await expect(page.getByRole('radio', { name: 'Monthly', exact: true })).toBeChecked();
    await expect(page.locator('label[for="fueling-month"]')).toHaveCSS('background-color', 'rgb(77, 24, 56)');
    await expect(page.getByText('Totals for each calendar month across all years.')).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('fueling.png'), fullPage: true });
});

test('car details links to fueling for the selected car', async ({ page, api }) => {
    api.useScenario([...scenarios.car, ...mocks.filter(mock => mock.resource.endsWith('/fuel') || mock.resource.endsWith('/bymonth'))]);
    await page.goto('/car/car-1');
    await page.getByRole('link', { name: 'Car Fueling', exact: true }).click();
    await expect(page).toHaveURL(/\/car\/car-1\/fueling$/);
    await api.assertLoaded();
    await expect(page.getByRole('heading', { name: 'Car Fueling', exact: true })).toBeVisible();
});

test('adds fueling once and refreshes history and both aggregate views', async ({ page, api }) => {
    await page.goto('/car/car-1/fueling');
    await api.assertLoaded();
    await page.getByRole('button', { name: 'Add fueling', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Add fueling' });
    const save = dialog.getByRole('button', { name: 'Save fueling' });
    await expect(save).toBeDisabled();
    for (const value of ['0', '-2']) {
        await dialog.getByLabel('Fuel volume').fill(value);
        await expect(save).toBeDisabled();
    }
    await dialog.getByLabel('Fuel volume').fill('25.5');
    await dialog.getByLabel('Date', { exact: true }).fill('');
    await expect(save).toBeDisabled();
    await dialog.getByLabel('Date', { exact: true }).fill('not-a-date');
    await expect(save).toBeDisabled();
    await expect(dialog.getByLabel('Date', { exact: true })).toHaveAttribute('type', 'text');
    await dialog.getByLabel('Date', { exact: true }).click();
    await dialog.locator('.rdtPicker .rdtDay[data-value="5"]:not(.rdtOld):not(.rdtNew)').click();
    await expect(dialog.getByLabel('Date', { exact: true })).toHaveValue('2026-10-05');
    await dialog.locator('.modal-title').click();
    let requests = 0;
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/test-api/car/car-1/fuel', async route => {
        if (route.request().method() === 'POST') {
            requests++;
            expect(route.request().postDataJSON()).toEqual({ date: '2026-10-05', amountInLiters: 25.5 });
            await gate;
            await route.fulfill({ status: 200, body: '' });
        } else {
            await route.fulfill({ json: [...history, { date: '2026-10-05', amountInLiters: 25.5 }] });
        }
    });
    await page.route('**/test-api/car/car-1/fuel/sum/byyear', route => route.fulfill({ json: [{ key: 2025, value: 40 }, { key: 2026, value: 135.5 }] }));
    await page.route('**/test-api/car/car-1/fuel/sum/bymonth', route => route.fulfill({ json: [{ key: 1, value: 100 }, { key: 10, value: 75.5 }] }));
    await save.click();
    await expect(dialog.getByRole('status', { name: 'Saving fueling' })).toBeVisible();
    await expect(save).toBeDisabled();
    await expect(dialog.getByLabel('Fuel volume')).toBeDisabled();
    await expect(dialog.getByLabel('Date', { exact: true })).toBeDisabled();
    await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await dialog.getByLabel('Fuel volume').press('Enter');
    release();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator('.toast')).toContainText('Success');
    await expect(page.locator('.toast')).toContainText('Fueling added.');
    await expect(page.getByText('175,50 L', { exact: true })).toBeVisible();
    await expect(page.getByRole('table', { name: 'Fueling history' }).getByRole('row')).toHaveCount(5);
    await expect(page.getByRole('table', { name: 'Fueling history' }).getByRole('cell', { name: '25,50 L', exact: true })).toBeVisible();
    await expectBar(page, 1, '2026', '135,50 L');
    await page.locator('label[for="fueling-month"]').click();
    await expectBar(page, 1, 'October', '75,50 L');
    expect(requests).toBe(1);
});

test('keeps failed save entries and allows retry', async ({ page, api }) => {
    await page.goto('/car/car-1/fueling');
    await api.assertLoaded();
    await page.getByRole('button', { name: 'Add fueling', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByLabel('Fuel volume').fill('20.75');
    let requests = 0;
    await page.route('**/test-api/car/car-1/fuel', async route => {
        if (route.request().method() === 'POST') {
            requests++;
            await route.fulfill({ status: requests === 1 ? 500 : 200, body: '' });
        } else await route.fallback();
    });
    await dialog.getByRole('button', { name: 'Save fueling' }).click();
    const toast = page.locator('.toast');
    await expect(toast).toContainText('Failed');
    await expect(toast).toContainText('Your entries have been kept.');
    await expect(toast).toBeInViewport({ ratio: 1 });
    await expect.poll(() => toast.evaluate(element => {
        const box = element.getBoundingClientRect();
        return element.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
    })).toBe(true);
    await expect(dialog.getByLabel('Fuel volume')).toHaveValue('20.75');
    await dialog.getByRole('button', { name: 'Save fueling' }).click();
    await expect(dialog).toHaveCount(0);
    expect(requests).toBe(2);
});

test('shows an empty state on phones and supports adding the first fueling', async ({ page, api }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 667 });
    api.useScenario(mocks.map(mock => mock.resource.includes('/fuel') ? { ...mock, body: [] } : mock));
    await page.goto('/car/car-1/fueling');
    await api.assertLoaded();
    await expect(page.getByText('0,00 L', { exact: true })).toBeVisible();
    await expect(page.getByText('No fuelings recorded yet. Add your first fueling to get started.')).toBeVisible();
    await page.getByRole('button', { name: 'Add fueling', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByLabel('Fuel volume')).toBeInViewport({ ratio: 1 });
    await expect(dialog.getByRole('button', { name: 'Save fueling' })).toBeInViewport({ ratio: 1 });
    await expect(page.locator('.modal-dialog')).toHaveCSS('transform', 'none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.screenshot({ path: testInfo.outputPath('fueling-phone.png'), fullPage: true });
});

test('shows loading and recoverable errors', async ({ page, api }) => {
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    let fail = true;
    await page.route('**/test-api/car/car-1/fuel/sum/byyear', async route => {
        if (fail) {
            await gate;
            await route.fulfill({ status: 500, body: '' });
        } else await route.fallback();
    });
    await page.goto('/car/car-1/fueling');
    await expect(page.getByRole('status')).toContainText('Loading fueling data');
    release();
    await expect(page.locator('.alert-danger')).toContainText('Could not load fueling data.');
    fail = false;
    await page.getByRole('button', { name: 'Retry' }).click();
    await api.assertLoaded();
    await expect(page.getByRole('table', { name: 'Fueling history' })).toBeVisible();
});

test('shows the full unpaged history for the requested car', async ({ page, api }) => {
    const records = Array.from({ length: 31 }, (_, index) => ({ date: `2026-01-${String(index + 1).padStart(2, '0')}`, amountInLiters: index + 1 }));
    api.useScenario(mocks.map(mock => ({ ...mock, resource: mock.resource.replace('car-1', 'car-2'), body: mock.resource.endsWith('/fuel') ? records : mock.body })));
    await page.goto('/car/car-2/fueling');
    await api.assertLoaded();
    await expect(page.getByRole('table', { name: 'Fueling history' }).getByRole('row')).toHaveCount(32);
});

test('summary and history fit a phone in dark mode', async ({ page, api }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 667 });
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
    await page.goto('/car/car-1/fueling');
    await api.assertLoaded();
    await expect(page.getByRole('table', { name: 'Fueling history' }).getByRole('row')).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.screenshot({ path: testInfo.outputPath('fueling-phone-history.png'), fullPage: true });
});
