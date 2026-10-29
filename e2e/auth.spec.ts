import { test, expect } from './fixtures';
import { scenarios } from './scenarios';

const authPath = '**/test-auth/realms/ivy/protocol/openid-connect/auth?*';
const tokenPath = '**/test-auth/realms/ivy/protocol/openid-connect/token';

for (const expired of [false, true]) {
    test(`returns to the requested route after login with ${expired ? 'an expired' : 'no'} session`, async ({ page, context, baseURL, api }) => {
        api.useScenario(scenarios.journal);
        const token = (await context.cookies())[0].value;
        if (expired) {
            await page.route('**/test-api/user', async route => {
                await route.fulfill({ status: 401 });
                await page.unroute('**/test-api/user');
            });
        } else {
            await context.clearCookies();
        }
        await page.route(authPath, route => route.fulfill({ contentType: 'text/html', body: 'Sign in' }));
        const requestedRoute = '/journal?search=hello%20world&tag=a%26b#entry-1';
        await page.goto(requestedRoute);
        await expect(page).toHaveURL(/\/test-auth\/.*\/auth\?/);
        const loginUrl = new URL(page.url());
        const redirectUri = new URL(loginUrl.searchParams.get('redirect_uri')!);
        const expectedRedirectUri = redirectUri.toString();
        expect(redirectUri.searchParams.get('callback')).toBe(requestedRoute);
        expect(loginUrl.searchParams.get('client_id')).toBe('web');
        expect((await context.cookies()).some(cookie => cookie.name === 'AccessToken')).toBe(false);

        await page.route(tokenPath, async route => {
            const payload = new URLSearchParams(route.request().postData()!);
            expect(payload.get('redirect_uri')).toBe(expectedRedirectUri);
            expect(payload.get('code')).toBe('test-code');
            await route.fulfill({ json: { access_token: token } });
        });
        redirectUri.searchParams.set('code', 'test-code');
        await page.goto(redirectUri.toString());
        await expect(page).toHaveURL(`${baseURL}${requestedRoute}`);
        await expect(page.getByText('Smoke test journal entry', { exact: true })).toBeVisible();
    });
}

for (const callback of [null, 'https://example.com', '//example.com', '/\\example.com']) {
    test(`uses the dashboard for callback ${JSON.stringify(callback)}`, async ({ page, baseURL }) => {
        await page.route(tokenPath, route => route.fulfill({ json: { access_token: 'test-token' } }));
        await page.route(`${baseURL}/`, route => route.fulfill({ contentType: 'text/html', body: 'Dashboard destination' }));
        const url = new URL(baseURL!);
        url.searchParams.set('code', 'test-code');
        if (callback !== null) url.searchParams.set('callback', callback);
        await page.goto(url.toString());
        await expect(page).toHaveURL(`${baseURL}/`);
        await expect(page.getByText('Dashboard destination')).toBeVisible();
    });
}

test('a failed token exchange does not redirect or store a token', async ({ page, context }) => {
    await context.clearCookies();
    await page.route(tokenPath, route => route.fulfill({ status: 400, json: { error: 'invalid_grant' } }));
    await page.goto('/?code=invalid&callback=%2Fjournal');
    await expect(page.getByText('API failed with Authentication failed')).toBeVisible();
    expect((await context.cookies()).some(cookie => cookie.name === 'AccessToken')).toBe(false);
});
