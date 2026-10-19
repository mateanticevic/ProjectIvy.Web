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
        await expect(navigation.locator('.active')).toHaveCount(1);
        await expect(navigation.getByRole('link', { name: 'Journal', exact: true })).toHaveAttribute('aria-current', 'page');
        await expect(navigation.getByRole('heading', { name: destination.menu, exact: true })).toBeVisible();
        await navigation.getByRole('link', { name: destination.link, exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`${destination.path}(\\?|$)`));
        await expect(page.getByText(destination.content, { exact: destination.scenario !== 'accounts' })).toBeVisible();
        await expect(navigation.locator('.active')).toHaveCount(1);
        await expect(navigation.getByRole('link', { name: destination.link, exact: true })).toHaveAttribute('aria-current', 'page');
        await page.goBack();
        await expect(navigation.locator('.active')).toHaveCount(1);
        await expect(navigation.getByRole('link', { name: 'Journal', exact: true })).toHaveAttribute('aria-current', 'page');
        await api.assertLoaded();
    });
}

test('shows the seeded user account menu', async ({ page, api }) => {
    api.useScenario(scenarios.journal);
    await page.goto('/journal');
    await api.assertLoaded();
    const navigation = page.getByRole('navigation');
    await expect(navigation.getByRole('heading', { name: 'Smoke User', exact: true })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'My account', exact: true })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Logout', exact: true }).last()).toBeVisible();
});

test('toggles the theme and preserves it after reload', async ({ page, api }) => {
    api.useScenario(scenarios.journal);
    await page.goto('/journal');
    await api.assertLoaded();
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
    const activeLink = page.getByRole('link', { name: 'Journal', exact: true });
    await expect(activeLink).toHaveCSS('background-color', 'rgb(89, 8, 57)');
    await expect(activeLink).toHaveCSS('color', 'rgb(255, 255, 255)');
    await page.getByLabel('Toggle theme', { exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
    await expect(activeLink).toHaveCSS('background-color', 'rgb(89, 8, 57)');
    await expect(activeLink).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
    await page.reload();
    await expect(page.getByText('Smoke test journal entry', { exact: true })).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
    await api.assertLoaded();
});

for (const width of [320, 991]) {
    test(`mobile navigation at ${width}px opens and closes after selection`, async ({ page, api }) => {
        await page.setViewportSize({ width, height: 640 });
        api.useScenario([...scenarios.journal, ...scenarios.todo]);
        await page.goto('/journal');
        await expect(page.getByText('Smoke test journal entry', { exact: true })).toBeVisible();
        const navigation = page.getByRole('navigation', { name: 'Main navigation' });
        const toggle = page.getByRole('button', { name: 'Toggle navigation' });
        await expect(navigation).not.toBeVisible();
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        for (const name of ['Finance', 'Travel', 'Other', 'Admin', 'Smoke User']) {
            await expect(navigation.getByRole('heading', { name, exact: true })).toBeVisible();
        }
        await navigation.getByRole('link', { name: 'Todo', exact: true }).click();
        await expect(page).toHaveURL(/\/todo$/);
        await expect(navigation).not.toBeVisible();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(page.getByText('Smoke Test Task', { exact: true })).toBeVisible();
        await toggle.click();
        await expect(navigation).toBeVisible();
        await expect(navigation.locator('.active')).toHaveCount(1);
        await expect(navigation.getByRole('link', { name: 'Todo', exact: true })).toHaveAttribute('aria-current', 'page');
        await api.assertLoaded();
    });
}

test('mobile drawer supports dismissal, focus restoration, and resizing', async ({ page, api }) => {
    await page.setViewportSize({ width: 390, height: 640 });
    api.useScenario(scenarios.journal);
    await page.goto('/journal');
    await api.assertLoaded();
    const toggle = page.getByRole('button', { name: 'Toggle navigation' });
    const navigation = page.getByRole('navigation', { name: 'Main navigation' });
    await toggle.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(navigation).not.toBeVisible();
    await expect(toggle).toBeFocused();
    await toggle.click();
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(navigation).not.toBeVisible();
    await toggle.click();
    await page.locator('.offcanvas-backdrop').click({ position: { x: 380, y: 100 } });
    await expect(navigation).not.toBeVisible();
    await toggle.click();
    await page.setViewportSize({ width: 992, height: 640 });
    await expect(navigation).toBeVisible();
    await expect(page.locator('.offcanvas-backdrop')).toHaveCount(0);
    await page.setViewportSize({ width: 390, height: 640 });
    await expect(navigation).not.toBeVisible();
});

for (const width of [320, 390, 991]) {
    test(`dashboard cards clear the mobile header at ${width}px`, async ({ page, api }) => {
        await page.setViewportSize({ width, height: 640 });
        api.useScenario(scenarios.dashboard);
        await page.goto('/');
        await api.assertLoaded();
        await expect(page.locator('.react-loading-skeleton')).toHaveCount(0);
        await expect(page.locator('.navigation-sidebar .nav-link.active')).toHaveCount(0);
        const header = page.getByRole('banner');
        const firstCard = page.getByRole('main').locator('.card').first();
        await expect(header).toBeVisible();
        await expect(firstCard.locator('.card-header')).toBeInViewport({ ratio: 1 });
        const headerBox = await header.boundingBox();
        const cardBox = await firstCard.boundingBox();
        expect(cardBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height + 16);
    });
}

for (const width of [390, 1440]) {
    for (const destination of [
        { path: '/calendar/2026/10', scenario: 'calendarMonth', link: 'Calendar' },
        { path: '/trips/trip-1', scenario: 'trip', link: 'Trips' },
        { path: '/beer/admin', scenario: 'beerAdmin', link: 'Manage beers' },
    ]) {
        test(`highlights only ${destination.link} at ${destination.path} on ${width}px`, async ({ page, api }) => {
            await page.setViewportSize({ width, height: 800 });
            api.useScenario(scenarios[destination.scenario]);
            await page.goto(destination.path);
            await api.assertLoaded();
            if (width < 992) {
                await page.getByRole('button', { name: 'Toggle navigation' }).click();
            }
            const navigation = page.getByRole('navigation', { name: 'Main navigation' });
            await expect(navigation.locator('.active')).toHaveCount(1);
            await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
            await expect(navigation.getByRole('link', { name: destination.link, exact: true })).toHaveAttribute('aria-current', 'page');
        });
    }
}

for (const width of [992, 1440]) {
    test(`desktop sidebar at ${width}px is fixed and scrollable`, async ({ page, api }) => {
        await page.setViewportSize({ width, height: 500 });
        api.useScenario(scenarios.journal);
        await page.goto('/journal');
        await api.assertLoaded();
        await expect(page.getByRole('button', { name: 'Toggle navigation' })).not.toBeVisible();
        const sidebar = page.locator('.navigation-sidebar');
        await expect(sidebar).toBeVisible();
        const sidebarBox = await sidebar.boundingBox();
        expect(sidebarBox?.x).toBe(0);
        expect(sidebarBox?.width).toBe(260);
        expect(sidebarBox?.height).toBe(500);
        const contentBox = await page.getByRole('main').boundingBox();
        expect(contentBox!.x).toBeGreaterThanOrEqual(260);
        const themeToggle = page.getByLabel('Toggle theme', { exact: true });
        await themeToggle.scrollIntoViewIfNeeded();
        await expect(themeToggle).toBeInViewport();
        expect(await sidebar.locator('.offcanvas-body').evaluate(element => element.scrollTop)).toBeGreaterThan(0);
        await themeToggle.click();
        await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');
    });
}
