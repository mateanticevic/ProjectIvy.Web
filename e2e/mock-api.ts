import { expect, type BrowserContext, type Request, type Route } from '@playwright/test';
import type { MockResponse } from './scenarios';
import { user } from './data';

interface RegisteredResponse extends MockResponse {
    calls: number;
}

export class MockApi {
    readonly issues: string[] = [];
    private responses: RegisteredResponse[] = [];
    private pending = new Set<Request>();

    constructor(private readonly origin: string) {
        this.useScenario([]);
    }

    useScenario(responses: MockResponse[]) {
        this.responses = structuredClone([
            { resource: 'user', body: user, allowedQuery: [] },
            ...responses,
        ]).map(response => ({ ...response, calls: 0 }));
    }

    async install(context: BrowserContext) {
        await context.route('**/*', route => this.handle(route));
        context.on('requestfinished', request => this.pending.delete(request));
        context.on('requestfailed', request => this.pending.delete(request));
        await context.routeWebSocket(/.*/, socket => {
            const url = new URL(socket.url());
            const origin = new URL(this.origin);
            // Vite 8's dev client still probes its disabled HMR socket.
            if (url.host === origin.host && url.pathname === '/' && url.searchParams.has('token')) {
                socket.close();
                return;
            }
            this.issues.push(`Unexpected WebSocket: ${socket.url()}`);
            socket.close();
        });
    }

    private async reject(route: Route, reason: string) {
        this.issues.push(`${reason}: ${route.request().method()} ${route.request().url()}`);
        await route.abort('blockedbyclient');
    }

    private async handle(route: Route) {
        const request = route.request();
        const url = new URL(request.url());
        const isLocal = url.origin === this.origin;

        if (isLocal && url.pathname.startsWith('/test-api/')) {
            const resource = url.pathname.slice('/test-api/'.length).toLowerCase();
            const query = new Map([...url.searchParams].map(([key, value]) => [key.toLowerCase(), value]));
            const response = this.responses.find(mock =>
                request.method() === 'GET'
                && mock.resource === resource
                && Object.entries(mock.query ?? {}).every(([key, value]) => query.get(key) === value)
                && [...query.keys()].every(key => mock.allowedQuery?.includes(key))
            );

            if (!response) {
                await this.reject(route, 'Unhandled Ivy API request (add an explicit scenario mock)');
                return;
            }

            this.pending.add(request);
            await route.fulfill({ json: response.body });
            response.calls++;
            return;
        }

        if (isLocal && /^\/(test-auth|test-hub|api|auth)(\/|$)/.test(url.pathname)) {
            await this.reject(route, 'Blocked backend/auth/hub request');
            return;
        }

        const isGoogle = /(^|\.)(googleapis\.com|gstatic\.com|google\.com)$/.test(url.hostname);
        const isBackend = /^(api|auth|hub)\.anticevic\.net$/.test(url.hostname);
        if (isBackend || (!isLocal && !isGoogle && ['fetch', 'xhr', 'document'].includes(request.resourceType()))) {
            await this.reject(route, 'Blocked external backend request');
            return;
        }

        // Real Google scripts/widgets and app/CDN assets remain available.
        await route.continue();
    }

    async assertLoaded() {
        expect(this.issues, 'Unexpected backend requests').toEqual([]);
        await expect.poll(() => ({
            missing: this.responses
                .filter(response => response.calls < (response.minimumCalls ?? 1))
                .map(response => `${response.resource} ${JSON.stringify(response.query ?? {})}`),
            pending: this.pending.size,
            issues: this.issues,
        }), { message: 'Initial mocked API requests must finish without unexpected requests' }).toEqual({ missing: [], pending: 0, issues: [] });
    }
}
