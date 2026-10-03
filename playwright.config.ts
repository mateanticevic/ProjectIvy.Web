import { defineConfig } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4173';

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,
    timeout: 60000,
    expect: { timeout: 15000 },
    reporter: [
        ['list'],
        ['html', { open: 'never' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
    ],
    use: {
        baseURL,
        viewport: { width: 1440, height: 1000 },
        timezoneId: 'Europe/Zagreb',
        serviceWorkers: 'block',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
    webServer: {
        command: 'npm run dev -- --mode e2e --host 127.0.0.1 --port 4173 --strictPort',
        url: baseURL,
        reuseExistingServer: false,
        env: {
            VITE_API_URL: `${baseURL}/test-api`,
            VITE_AUTH_URL: `${baseURL}/test-auth`,
            VITE_HUB_URL: `${baseURL}/test-hub`,
            VITE_APP_URL: baseURL,
            VITE_ACCESS_TOKEN_COOKIE_DOMAIN: '127.0.0.1',
        },
    },
});
