import { test, expect, type BrowserContext } from '@playwright/test';
import { MockApi } from './mock-api';

async function installHarness(context: BrowserContext, baseURL: string) {
    const api = new MockApi(baseURL);
    await api.install(context);
    await context.route(`${baseURL}/mock-harness`, route => route.fulfill({
        contentType: 'text/html', body: '<!doctype html><title>Mock harness</title>',
    }));
    return api;
}

test('blocks unmocked API requests with a useful diagnostic', async ({ context, page, baseURL }) => {
    const api = await installHarness(context, baseURL!);
    await page.goto('/mock-harness');
    const result = await page.evaluate(() => fetch('/test-api/not-mocked').then(() => 'escaped').catch(() => 'blocked'));
    expect(result).toBe('blocked');
    expect(api.issues).toEqual([
        `Unhandled Ivy API request (add an explicit scenario mock): GET ${baseURL}/test-api/not-mocked`,
    ]);
});

test('rejects unexpected methods and query values', async ({ context, page, baseURL }) => {
    const api = await installHarness(context, baseURL!);
    api.useScenario([{ resource: 'todo', body: [], query: { iscompleted: 'false' }, allowedQuery: ['iscompleted'] }]);
    await page.goto('/mock-harness');
    const results = await page.evaluate(async () => Promise.all([
        fetch('/test-api/todo?IsCompleted=true'),
        fetch('/test-api/todo?IsCompleted=false', { method: 'POST' }),
        fetch('/test-api/todo?IsCompleted=false&Unexpected=true'),
    ].map(request => request.then(() => 'escaped').catch(() => 'blocked'))));
    expect(results).toEqual(['blocked', 'blocked', 'blocked']);
    expect(api.issues).toHaveLength(3);
    expect(api.issues.every(issue => issue.startsWith('Unhandled Ivy API request'))).toBe(true);
});

test('blocks local auth, hub, legacy proxy and live backend requests', async ({ context, page, baseURL }) => {
    const api = await installHarness(context, baseURL!);
    await page.goto('/mock-harness');
    const results = await page.evaluate(async () => Promise.all([
        '/test-auth/token', '/test-hub/JobHub/negotiate', '/api/user', '/auth/token',
        'https://api.anticevic.net/user', 'https://auth.anticevic.net/token', 'https://hub.anticevic.net/JobHub/negotiate',
    ].map(url => fetch(url).then(() => 'escaped').catch(() => 'blocked'))));
    expect(results).toEqual(Array(7).fill('blocked'));
    expect(api.issues).toHaveLength(7);
    expect(api.issues.every(issue => issue.startsWith('Blocked'))).toBe(true);
});

test('isolates mocks and storage between browser contexts', async ({ browser, baseURL }) => {
    const contexts = await Promise.all([browser.newContext(), browser.newContext()]);
    try {
        const results = await Promise.all(contexts.map(async (context, index) => {
            const api = await installHarness(context, baseURL!);
            const body = { name: `Context ${index}` };
            api.useScenario([{ resource: 'isolation', body, allowedQuery: [] }]);
            body.name = 'Changed outside registered fixture';
            const page = await context.newPage();
            await page.goto(`${baseURL}/mock-harness`);
            const initialTheme = await page.evaluate(() => localStorage.getItem('theme'));
            await page.evaluate(value => localStorage.setItem('theme', value), `theme-${index}`);
            const response = await page.evaluate(() => fetch('/test-api/isolation').then(response => response.json()));
            expect(api.issues).toEqual([]);
            return { response, initialTheme, theme: await page.evaluate(() => localStorage.getItem('theme')) };
        }));
        expect(results).toEqual([
            { response: { name: 'Context 0' }, initialTheme: null, theme: 'theme-0' },
            { response: { name: 'Context 1' }, initialTheme: null, theme: 'theme-1' },
        ]);
    } finally {
        await Promise.all(contexts.map(context => context.close()));
    }
});
