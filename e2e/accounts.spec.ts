import { account } from './data';
import { expect, test } from './fixtures';
import { scenarios } from './scenarios';

for (const width of [390, 1440]) {
    test(`positions the account menu beside its button at ${width}px`, async ({ page, api }) => {
        await page.setViewportSize({ width, height: 900 });
        api.useScenario(scenarios.accounts);
        await page.goto('/accounts');
        await api.assertLoaded();

        const actions = page.getByRole('button', { name: `Actions for ${account.name}` });
        await actions.click();
        const menu = page.locator('.dropdown-menu').filter({ has: page.getByRole('button', { name: 'Re-link', exact: true }) });
        await expect(menu).toBeInViewport();
        await expect.poll(async () => {
            const toggle = (await actions.boundingBox())!;
            const dropdown = (await menu.boundingBox())!;
            const verticalGap = Math.min(Math.abs(dropdown.y - toggle.y - toggle.height), Math.abs(toggle.y - dropdown.y - dropdown.height));
            const rightEdgeOffset = Math.abs(dropdown.x + dropdown.width - toggle.x - toggle.width);
            return Math.max(verticalGap, rightEdgeOffset);
        }).toBeLessThanOrEqual(8);
    });
}

test('re-links an account and reports the result or failure', async ({ page, api }) => {
    api.useScenario(scenarios.accounts);
    let release!: () => void;
    const pending = new Promise<void>(resolve => { release = resolve; });
    let requests = 0;
    await page.route(`**/test-api/account/${account.id}/transaction/link`, async route => {
        expect(route.request().method()).toBe('POST');
        expect(route.request().postData()).toBeNull();
        if (++requests === 1) {
            await pending;
            await route.fulfill({ json: { linkedCount: 4, unlinkedCount: 0, totalTransactionCount: 9 } });
        } else {
            await route.fulfill({ status: 500 });
        }
    });
    await page.goto('/accounts');
    await api.assertLoaded();

    const actions = page.getByRole('button', { name: `Actions for ${account.name}` });
    const relink = page.getByRole('button', { name: 'Re-link', exact: true });
    await actions.click();
    await relink.click();
    try {
        await expect(actions).toBeDisabled();
        await expect(page.getByRole('status', { name: 'Re-linking transactions' })).toBeVisible();
    } finally {
        release();
    }
    await expect(page.getByText(`Transactions re-linked for ${account.name}. 4 linked, 0 unlinked, 9 total.`)).toBeVisible();
    await expect(actions).toBeEnabled();

    await actions.click();
    await relink.click();
    await expect(page.getByText(`Failed to re-link transactions for ${account.name}.`)).toBeVisible();
    await expect(actions).toBeEnabled();
    expect(requests).toBe(2);
});
