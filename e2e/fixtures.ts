import { test as base, expect } from '@playwright/test';
import { MockApi } from './mock-api';

export const test = base.extend<{ api: MockApi }>({
    api: [async ({ context, page, baseURL }, use, testInfo) => {
        const api = new MockApi(new URL(baseURL!).origin);
        const browserErrors: string[] = [];
        context.on('weberror', error => browserErrors.push(error.error().stack ?? error.error().message));
        await api.install(context);
        const tokenPart = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
        const token = `${tokenPart({ alg: 'none', typ: 'JWT' })}.${tokenPart({ name: 'Smoke User', scope: 'openid beer:user' })}.test`;
        await context.addCookies([{ name: 'AccessToken', value: token, url: baseURL!, httpOnly: false }]);
        await page.clock.setFixedTime(new Date('2026-10-03T12:00:00+02:00'));
        await page.addInitScript(() => {
            if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'light');
        });

        await use(api);

        if (api.issues.length || browserErrors.length) {
            await testInfo.attach('browser-and-network-errors', {
                body: JSON.stringify({ network: api.issues, browser: browserErrors }, null, 4),
                contentType: 'application/json',
            });
        }
        expect(api.issues, 'Unexpected backend requests').toEqual([]);
        expect(browserErrors, 'Uncaught browser errors').toEqual([]);
    }, { auto: true }],
});

export { expect };
