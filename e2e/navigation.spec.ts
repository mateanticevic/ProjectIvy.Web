import { test, expect } from './fixtures';
import { scenarios } from './scenarios';

const destinations = [
    { menu: 'Finance', link: 'Accounts', path: '/accounts', scenario: 'accounts', content: 'Test Current Account' },
    { menu: 'Travel', link: 'Flights', path: '/flights', scenario: 'flights', content: 'ZAG - SPU' },
    { menu: 'Other', link: 'Todo', path: '/todo', scenario: 'todo', content: 'Smoke Test Task' },
    { menu: 'Admin', link: 'Expense Types', path: '/expense-types', scenario: 'expenseTypes', content: 'Food' },
];

for (const destination of destinations) {
    test(`navigates through ${destination.menu}`, async ({ page, api }) => {
        api.useScenario([...scenarios.journal, ...scenarios[destination.scenario]]);
        await page.goto('/journal');
        await expect(page.getByText('Smoke test journal entry', { exact: true })).toBeVisible();
        const navigation = page.getByRole('navigation');
        await navigation.getByRole('button', { name: destination.menu, exact: true }).click();
        await navigation.getByRole('link', { name: destination.link, exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`${destination.path}(\\?|$)`));
        await expect(page.getByText(destination.content, { exact: destination.scenario !== 'accounts' })).toBeVisible();
        await api.assertLoaded();
    });
}

test('shows the seeded user account menu', async ({ page, api }) => {
    api.useScenario(scenarios.journal);
    await page.goto('/journal');
    await api.assertLoaded();
    const navigation = page.getByRole('navigation');
    await navigation.getByRole('button', { name: 'Smoke User', exact: true }).click();
    await expect(navigation.getByRole('link', { name: 'My account', exact: true })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Logout', exact: true }).last()).toBeVisible();
});

test('toggles the theme and preserves it after reload', async ({ page, api }) => {
    api.useScenario(scenarios.journal);
    await page.goto('/journal');
    await api.assertLoaded();
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
    await page.getByLabel('Toggle theme', { exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
    await page.reload();
    await expect(page.getByText('Smoke test journal entry', { exact: true })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
    await api.assertLoaded();
});
