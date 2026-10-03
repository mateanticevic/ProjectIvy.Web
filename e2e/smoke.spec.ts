import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { scenarios } from './scenarios';

interface SmokePage {
    path: string;
    scenario: string;
    text?: string;
    map?: boolean;
    assert?: (page: Page) => Promise<void>;
}

const pages: SmokePage[] = [
    { path: '/', scenario: 'dashboard', text: '42000 km', map: true },
    { path: '/accounts', scenario: 'accounts', assert: async page => {
        await expect(page.getByText('Test Current Account (EUR)', { exact: false })).toBeVisible();
    } },
    { path: '/beer', scenario: 'beer', text: 'Test Lager (Test Brewery)' },
    { path: '/beer/admin', scenario: 'beerAdmin', assert: async page => {
        await expect(page.locator('input[value="Test Lager"]')).toHaveValue('Test Lager');
        await expect(page.locator('input[value="Test Brewery"]')).toHaveValue('Test Brewery');
    } },
    { path: '/calendar', scenario: 'calendarYear', assert: assertYear },
    { path: '/calendar/2026', scenario: 'calendarYear', assert: assertYear },
    { path: '/calendar/2026/10', scenario: 'calendarMonth', text: 'Smoke Test Movie', assert: async page => {
        await expect(page.getByRole('button', { name: 'Select month' })).toHaveText('October 2026');
        await expect(page.locator('.calendar-item')).toHaveCount(31);
    } },
    { path: '/calendar/2026/10/3', scenario: 'calendarDay', map: true, assert: async page => {
        await expect(page.getByText('Loading trackings...')).toHaveCount(0);
        await expect(page.getByRole('alert')).toHaveCount(0);
    } },
    { path: '/calls', scenario: 'calls', text: 'Test Caller' },
    { path: '/car/car-1', scenario: 'car', text: 'Test Car', assert: async page => {
        await expect(page.getByText('Oil change', { exact: true })).toBeVisible();
    } },
    { path: '/car/car-1/timeline', scenario: 'carTimeline', text: 'Oil change' },
    { path: '/expenses', scenario: 'expenses', text: 'Smoke test lunch' },
    { path: '/expense-types', scenario: 'expenseTypes', text: 'Food' },
    { path: '/flights', scenario: 'flights', text: 'ZAG - SPU' },
    { path: '/incomes', scenario: 'incomes', text: 'Smoke Test Salary' },
    { path: '/net-worth', scenario: 'netWorth', text: 'Expenses vs incomes', assert: async page => {
        await expect(page.getByText('Loading monthly totals...')).toHaveCount(0);
        await expect(page.locator('.recharts-surface').first()).toBeVisible();
        await expect(page.getByRole('alert')).toHaveCount(0);
    } },
    { path: '/inventory', scenario: 'inventory', text: 'Test Backpack' },
    { path: '/movies', scenario: 'movies', text: 'Smoke Test Movie' },
    { path: '/places', scenario: 'places', text: 'Geohash precision', map: true },
    { path: '/pois', scenario: 'pois', text: 'Test Cafe', map: true },
    { path: '/routes', scenario: 'routes', text: 'Choose a start and an end to see routes.' },
    { path: '/tracking', scenario: 'tracking', text: 'Timezone', map: true },
    { path: '/todo', scenario: 'todo', text: 'Smoke Test Task', assert: async page => {
        await page.getByRole('tab', { name: 'Completed', exact: true }).click();
        await expect(page.getByText('Completed Smoke Task', { exact: true })).toBeVisible();
    } },
    { path: '/journal', scenario: 'journal', text: 'Smoke test journal entry' },
    { path: '/trips', scenario: 'trips', text: 'Smoke Test Trip', assert: async page => {
        await expect(page.locator('.panel-medium svg')).toBeVisible();
    } },
    { path: '/trips/trip-1', scenario: 'trip', text: 'Smoke test lunch', map: true },
];

async function assertYear(page: Page) {
    await expect(page.getByRole('heading', { name: '2026', exact: true })).toBeVisible();
    await expect(page.locator('.work-day-legend__label').getByText('Remote', { exact: true })).toBeVisible();
}

for (const smoke of pages) {
    test(`renders ${smoke.path} with mocked data`, async ({ page, api }) => {
        api.useScenario(scenarios[smoke.scenario]);
        await page.goto(smoke.path);
        if (smoke.text) {
            await expect(page.getByText(smoke.text, { exact: true }).first()).toBeVisible();
        }
        await api.assertLoaded();
        await smoke.assert?.(page);
        if (smoke.map) {
            await expect(page.getByRole('region', { name: 'Map', exact: true }).first()).toBeVisible();
        }
        await expect(page.getByText('Connecting to the api...')).toHaveCount(0);
        await expect(page.locator('.react-loading-skeleton')).toHaveCount(0);
    });
}
