import { test, expect } from './fixtures';
import { scenarios } from './scenarios';

for (const width of [390, 1440]) {
    for (const theme of ['light', 'dark']) {
        test(`place suggestions cover precision controls at ${width}px in ${theme} theme`, async ({ page, api }) => {
            await page.setViewportSize({ width, height: 800 });
            await page.addInitScript(selectedTheme => localStorage.setItem('theme', selectedTheme), theme);
            api.useScenario(scenarios.places.map(mock => mock.resource === 'country'
                ? { ...mock, body: { count: 5, items: Array.from({ length: 5 }, (_, index) => ({ id: `country-${index}`, name: `Test country ${index + 1}` })) } }
                : mock));
            await page.goto('/places');
            await api.assertLoaded();
            await page.getByRole('combobox').fill('Test');
            const suggestions = page.getByRole('listbox');
            await expect(suggestions.getByRole('option')).toHaveCount(5);
            await expect(page.getByRole('radio', { name: '3', exact: true })).toBeChecked();
            const precision = page.locator('label[for="3"]');
            const precisionBox = await precision.boundingBox();
            const menuBox = await suggestions.boundingBox();
            const point = { x: precisionBox!.x + precisionBox!.width / 2, y: precisionBox!.y + precisionBox!.height / 2 };
            expect(point.x).toBeGreaterThan(menuBox!.x);
            expect(point.x).toBeLessThan(menuBox!.x + menuBox!.width);
            expect(point.y).toBeGreaterThan(menuBox!.y);
            expect(point.y).toBeLessThan(menuBox!.y + menuBox!.height);
            await expect.poll(() => suggestions.evaluate((menu, position) => menu.contains(document.elementFromPoint(position.x, position.y)), point)).toBe(true);
            await page.getByRole('combobox').press('Escape');
            await expect(suggestions).toHaveCount(0);
            await page.locator('label[for="4"]').click();
            await expect(page.getByRole('radio', { name: '4', exact: true })).toBeChecked();
        });
    }
}
