import { test, expect } from './fixtures';
import { scenarios } from './scenarios';
import { user } from './data';

for (const width of [390, 1440]) {
    test(`My Account shows the current profile at ${width}px`, async ({ page, api }, testInfo) => {
        await page.setViewportSize({ width, height: 900 });
        if (width === 390) {
            await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
        }
        api.useScenario(scenarios.journal);
        await page.goto('/journal');
        await api.assertLoaded();
        if (width < 992) {
            await page.getByRole('button', { name: 'Toggle navigation' }).click();
        }
        await page.getByRole('link', { name: 'My Account', exact: true }).click();
        await expect(page).toHaveURL(/\/account$/);
        const navigation = page.getByRole('navigation', { name: 'Main navigation' });
        await expect(navigation.locator('.active')).toHaveCount(1);
        await expect(navigation.getByRole('link', { name: 'My Account', exact: true })).toHaveCSS('background-color', 'rgb(89, 8, 57)');
        if (width < 992) {
            await expect(navigation).not.toBeVisible();
        }
        const main = page.getByRole('main');
        await expect(main.getByRole('heading', { name: 'My Account', exact: true })).toBeVisible();
        for (const value of [user.firstName, user.lastName, user.username, user.email, 'Euro (EUR)', 'Test Car']) {
            await expect(main.locator('dd').getByText(value, { exact: true })).toBeVisible();
        }
        await expect(main.locator('dt', { hasText: 'Tracking since' }).locator('xpath=following-sibling::dd[1]')).toHaveText('January 1, 2026');
        await expect(main.locator('input, select, textarea, button')).toHaveCount(0);
        expect(await main.evaluate(element => element.scrollWidth)).toBeLessThanOrEqual(width);
        await page.screenshot({ path: testInfo.outputPath('account.png'), fullPage: true });
    });
}

test('missing profile values are shown without exposing extra response fields', async ({ page }) => {
    await page.route('**/test-api/user', route => route.fulfill({ json: {
        username: 'a-very-long-user-name-that-should-wrap-without-overflowing-the-phone-layout',
        firstName: null, lastName: null, email: '', defaultCurrency: null, defaultCar: null, trackingStartDate: null,
        accessToken: 'private-value-must-not-appear',
    } }));
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto('/account');
    const main = page.getByRole('main');
    await expect(main.getByRole('heading', { name: 'My Account', exact: true })).toBeVisible();
    await expect(main.locator('dd', { hasText: 'Not provided' })).toHaveCount(3);
    await expect(main.locator('dd', { hasText: 'Not set' })).toHaveCount(3);
    await expect(main).not.toContainText('private-value-must-not-appear');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('direct account navigation uses the shared loading and error state', async ({ page }) => {
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/test-api/user', async route => {
        await gate;
        await route.fulfill({ status: 500, body: '' });
    });
    await page.goto('/account');
    await expect(page.getByText('Connecting to the api...')).toBeVisible();
    release();
    await expect(page.getByText('API failed with 500')).toBeVisible();
    await expect(page.getByText('Connecting to the api...')).toHaveCount(0);
});
