import type { Locator, Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { scenarios } from './scenarios';

async function expectThemeFocus(page: Page, control: Locator) {
    const expected = await page.evaluate(() => {
        const probe = document.createElement('div');
        probe.style.borderColor = 'var(--ivy-input-focus-border-color)';
        probe.style.boxShadow = 'var(--ivy-input-focus-box-shadow)';
        document.body.append(probe);
        const style = getComputedStyle(probe);
        const result = { border: style.borderColor, shadow: style.boxShadow };
        probe.remove();
        return result;
    });
    expect(expected.shadow).not.toBe('none');
    await expect(control).toHaveCSS('border-color', expected.border);
    await expect(control).toHaveCSS('box-shadow', expected.shadow);
}

for (const theme of ['light', 'dark']) {
    test.describe(`${theme} input focus`, () => {
        test.beforeEach(async ({ page }) => {
            await page.addInitScript(selectedTheme => localStorage.setItem('theme', selectedTheme), theme);
        });

        test('native inputs, selects, textareas and date pickers use the primary palette', async ({ page, api }) => {
            api.useScenario(scenarios.expenses);
            await page.goto('/expenses');
            await api.assertLoaded();
            const date = page.locator('.rdt input').first();
            await date.focus();
            await expectThemeFocus(page, date);
            await page.getByRole('button', { name: 'More filters' }).click();
            const select = page.locator('select').first();
            await select.focus();
            await expect(select).toBeFocused();
            await expectThemeFocus(page, select);
            await page.getByRole('button', { name: 'Expense actions', exact: true }).click();
            await page.getByRole('button', { name: 'Split', exact: true }).click();
            const dialog = page.getByRole('dialog');
            for (const control of [dialog.getByRole('spinbutton').first(), dialog.getByLabel('Type', { exact: true }).first(), dialog.getByLabel('Comment').first()]) {
                await control.focus();
                await expectThemeFocus(page, control);
            }
            const comment = dialog.getByLabel('Comment').first();
            const originalBorder = await comment.evaluate(element => getComputedStyle(element).borderColor);
            await page.evaluate(() => document.documentElement.style.setProperty('--bs-primary', '#147d64'));
            await expectThemeFocus(page, comment);
            expect(await comment.evaluate(element => getComputedStyle(element).borderColor)).not.toBe(originalBorder);
        });

        test('async search focus follows primary color, including hover and runtime changes', async ({ page, api }) => {
            api.useScenario(scenarios.places);
            await page.goto('/places');
            await api.assertLoaded();
            const input = page.getByRole('combobox');
            await input.focus();
            await expect(input).toBeFocused();
            const control = page.locator('[class$="-control"]');
            await expectThemeFocus(page, control);
            await control.hover();
            await expectThemeFocus(page, control);
            const originalBorder = await control.evaluate(element => getComputedStyle(element).borderColor);
            await page.evaluate(() => document.documentElement.style.setProperty('--bs-primary', '#147d64'));
            await expectThemeFocus(page, control);
            expect(await control.evaluate(element => getComputedStyle(element).borderColor)).not.toBe(originalBorder);
        });

        test('checkboxes retain a visible themed focus ring', async ({ page, api }) => {
            api.useScenario(scenarios.todo);
            await page.goto('/todo');
            await api.assertLoaded();
            const checkbox = page.getByRole('checkbox').first();
            await checkbox.focus();
            await expect(checkbox).toBeFocused();
            await expectThemeFocus(page, checkbox);
        });
    });
}
