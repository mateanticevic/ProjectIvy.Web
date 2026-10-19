import { test, expect } from './fixtures';
import { scenarios } from './scenarios';

test('spaces weight measurements by elapsed time and sorts dates chronologically', async ({ page, api }) => {
    api.useScenario(scenarios.dashboard.map(mock => mock.resource === 'user/weight'
        ? { ...mock, body: [
            { key: '2026-01-11', value: 70 },
            { key: '2026-01-01', value: 70 },
            { key: '2026-01-02', value: 80 },
        ] }
        : mock));
    await page.goto('/');
    await api.assertLoaded();
    const card = page.getByRole('main').locator('.card').filter({ has: page.locator('.card-header', { hasText: 'Weight' }) });
    await card.scrollIntoViewIfNeeded();
    const curve = card.locator('.recharts-line-curve');
    await expect(curve).toBeVisible();

    // The peak is one day into a ten-day range, so it belongs at 10% of the plot width.
    const geometry = () => curve.evaluate(element => {
        const path = element as SVGPathElement;
        const length = path.getTotalLength();
        const start = path.getPointAtLength(0);
        const end = path.getPointAtLength(length);
        let peak = start;
        for (let index = 1; index <= 2000; index++) {
            const point = path.getPointAtLength(length * index / 2000);
            if (point.y < peak.y) peak = point;
        }
        return { ratio: (peak.x - start.x) / (end.x - start.x), x: peak.x, y: peak.y };
    });
    await expect.poll(async () => (await geometry()).ratio).toBeCloseTo(0.1, 2);
    const peak = await geometry();
    const surface = await card.getByRole('application').boundingBox();
    await page.mouse.move(surface!.x + peak.x, surface!.y + peak.y);
    const tooltip = card.locator('.recharts-tooltip-wrapper');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Jan 2 26');
    await expect(tooltip).toContainText('80kg');
    await expect(card.locator('.recharts-xAxis-tick-labels')).toContainText('Jan');
});
