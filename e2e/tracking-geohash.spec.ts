import geohash from 'ngeohash';
import { test, expect } from './fixtures';
import { scenarios } from './scenarios';
import { tracking } from './data';

test('tracking requests one covering parent and retains loaded geohashes', async ({ page, api }) => {
    api.useScenario(scenarios.tracking);
    const requests: { parent: string; precision: number }[] = [];
    await page.route('**/test-api/geohash/*/children?*', async route => {
        const url = new URL(route.request().url());
        const parent = url.pathname.split('/').at(-2)!;
        const precision = Number(url.searchParams.get('Precision'));
        requests.push({ parent, precision });
        // Include a visited cell outside the viewport to verify that it is not rendered.
        await route.fulfill({ json: precision === 1 ? ['u', 's'] : ['u25k9', 'u25ke'] });
    });
    let lineRequests = 0;
    await page.route('**/test-api/tracking?*', async route => {
        lineRequests++;
        await route.fulfill({ json: [tracking] });
    });
    await page.goto('/tracking');
    await api.assertLoaded();
    await expect(page.getByRole('region', { name: 'Map', exact: true })).toBeVisible();
    const renderingSwitch = page.getByRole('switch', { name: 'Show geohashes' });
    await expect(renderingSwitch).not.toBeChecked();
    await expect(page.getByText('Geohash precision', { exact: true })).toBeVisible();
    await page.locator('label[for="geohash-precision-5"]').click();
    await expect(page.getByRole('radio', { name: '5', exact: true })).toBeChecked();
    await page.locator('label[for="geohash-precision-1"]').click();
    await page.getByRole('button', { name: 'Draw', exact: true }).click();
    await expect(page.locator('button[aria-controls^="polyline-layer-"]')).toHaveCount(1);
    expect(lineRequests).toBe(1);
    expect(requests).toEqual([]);
    const move = async (south: number, west: number, north: number, east: number) => {
        await page.evaluate(bounds => window.dispatchEvent(new CustomEvent('test-map-bounds', { detail: bounds })), { south, west, north, east });
    };
    await move(45.8, 15.9, 45.81, 15.91);
    await renderingSwitch.check();
    await expect(page.getByRole('radio', { name: '1', exact: true })).toBeChecked();
    await expect.poll(() => requests).toEqual([{ parent: 'root', precision: 1 }]);
    await expect(page.locator('[data-rectangle]')).toHaveCount(1);
    await page.getByRole('button', { name: 'Draw', exact: true }).click();
    await expect(page.locator('button[aria-controls^="polyline-layer-"]')).toHaveCount(2);
    expect(lineRequests).toBe(2);
    expect(requests).toHaveLength(1);
    await expect(renderingSwitch).toBeChecked();
    await move(-10, 15.9, -9.99, 15.91);
    await expect(page.locator('[data-rectangle]')).toHaveCount(2);
    await expect(page.locator('[data-rectangle]').last()).toHaveAttribute('data-options', /"fillOpacity":0.4/);
    await move(45.8, 15.9, 45.81, 15.91);
    await expect(page.locator('[data-rectangle]').first()).toHaveAttribute('data-options', /"fillOpacity":0,/);
    expect(requests).toHaveLength(1);

    await page.locator('label[for="geohash-precision-5"]').click();
    await expect.poll(() => requests).toEqual([{ parent: 'root', precision: 1 }, { parent: 'u25k', precision: 5 }]);
    const expected = geohash.bboxes(45.8, 15.9, 45.81, 15.91, 5);
    await expect(page.locator('[data-rectangle]')).toHaveCount(expected.length);
    const rectangles = await page.locator('[data-rectangle]').evaluateAll(elements => elements.map(element => ({
        bounds: JSON.parse((element as HTMLElement).dataset.rectangle!),
        options: JSON.parse((element as HTMLElement).dataset.options!),
    })));
    expect(rectangles.map(rectangle => rectangle.bounds)).toEqual(expected.map(hash => {
        const [south, west, north, east] = geohash.decode_bbox(hash);
        return { south, west, north, east };
    }));
    expect(rectangles.map(rectangle => rectangle.options.fillOpacity)).toEqual([0, 0.4]);

    await move(45.801, 15.901, 45.811, 15.911);
    await expect(page.locator('[data-rectangle]')).toHaveCount(2);
    expect(requests).toHaveLength(2);
    await move(46.8, 16.9, 46.81, 16.91);
    await expect.poll(() => requests.at(-1)).toEqual({ parent: 'u2k4', precision: 5 });
    expect(requests).toHaveLength(3);
    await expect(page.locator('[data-rectangle]')).toHaveCount(4);
    await move(45.8, 15.9, 45.81, 15.91);
    await expect(page.locator('[data-rectangle]').first()).toHaveAttribute('data-options', /"fillOpacity":0,/);
    expect(requests).toHaveLength(3);

    // Crossing the equator has no shared geohash prefix, so use one root request.
    await move(-0.001, 15.9, 0.001, 15.91);
    await expect.poll(() => requests.at(-1)).toEqual({ parent: 'root', precision: 5 });
    expect(requests).toHaveLength(4);
    await move(-80, -170, 80, 170);
    await expect(page.getByRole('status')).toHaveText('Zoom in to show geohashes at this precision.');
    await expect(page.locator('[data-rectangle]')).toHaveCount(4 + geohash.bboxes(-0.001, 15.9, 0.001, 15.91, 5).length);
    expect(requests).toHaveLength(4);
    await renderingSwitch.uncheck();
    await move(45.8, 15.9, 45.81, 15.91);
    await page.locator('label[for="geohash-precision-6"]').click();
    await expect(page.getByRole('radio', { name: '6', exact: true })).toBeChecked();
    await expect(page.locator('[data-rectangle]')).toHaveCount(0);
    expect(requests).toHaveLength(4);
    await expect(page.locator('button[aria-controls^="polyline-layer-"]')).toHaveCount(2);
    await renderingSwitch.check();
    await expect.poll(() => requests.at(-1)).toEqual({ parent: 'u25k', precision: 6 });
    await expect(page.locator('[data-rectangle]')).toHaveCount(geohash.bboxes(45.8, 15.9, 45.81, 15.91, 6).length);
    expect(requests).toHaveLength(5);
});

test('map footer spinner stays visible until all requests settle', async ({ page, api }) => {
    api.useScenario(scenarios.tracking);
    const pending: import('@playwright/test').Route[] = [];
    await page.route('**/test-api/geohash/*/children?*', route => { pending.push(route); });
    await page.goto('/tracking');
    await api.assertLoaded();
    await expect(page.getByRole('region', { name: 'Map', exact: true })).toBeVisible();
    const spinner = page.getByRole('status', { name: 'Loading geohashes' });
    await expect(spinner).toHaveCount(0);
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('test-map-bounds', {
        detail: { south: 45.8, west: 15.9, north: 45.81, east: 15.91 },
    })));
    const renderingSwitch = page.getByRole('switch', { name: 'Show geohashes' });
    await renderingSwitch.check();
    await expect.poll(() => pending.length).toBe(1);
    await expect(spinner).toBeVisible();
    await expect(spinner.locator('..')).toHaveClass(/card-footer/);
    await expect(spinner).toHaveClass(/ms-auto/);
    await expect(spinner.locator('..').getByRole('radio', { name: 'Drag', exact: true })).toBeAttached();
    await expect(spinner.locator('../..').getByRole('region', { name: 'Map', exact: true })).toBeVisible();
    await page.locator('label[for="geohash-precision-5"]').click();
    await expect.poll(() => pending.length).toBe(2);
    await pending[1].fulfill({ json: ['u25k9'] });
    await expect(page.locator('[data-rectangle]')).toHaveCount(2);
    await expect(spinner).toBeVisible();
    await renderingSwitch.uncheck();
    await expect(spinner).toBeVisible();
    await pending[0].fulfill({ status: 500, json: { error: 'Test failure' } });
    await expect(spinner).toHaveCount(0);

    await renderingSwitch.check();
    await expect.poll(() => pending.length).toBe(3);
    await pending[2].fulfill({ json: ['u25k9'] });
    await expect(spinner).toHaveCount(0);

    // Bounds change before the map becomes idle: start loading the new parent immediately.
    await page.evaluate(() => window.dispatchEvent(new CustomEvent('test-map-bounds', {
        detail: { south: 46.8, west: 16.9, north: 46.81, east: 16.91, idle: false },
    })));
    await expect.poll(() => pending.length).toBe(4);
    await expect(spinner).toBeVisible();
    await expect(page.locator('[data-rectangle]')).toHaveCount(2);
    await pending[3].fulfill({ json: [] });
    await expect(spinner).toHaveCount(0);
    await expect(page.locator('[data-rectangle]')).toHaveCount(4);

    await page.evaluate(() => window.dispatchEvent(new CustomEvent('test-map-bounds', {
        detail: { south: 46.801, west: 16.901, north: 46.811, east: 16.911, idle: false },
    })));
    await expect(spinner).toHaveCount(0);
    expect(pending).toHaveLength(4);
});
