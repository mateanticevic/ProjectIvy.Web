import { test, expect } from './fixtures';
import { scenarios } from './scenarios';
import { trip, city } from './data';
import { getStayTimeline } from '../src/pages/trip-details/stay-timeline';

const stay = (id: number, from: string, to: string) => ({ id, from, to, city });
const start = '2026-10-01';
const end = '2026-10-10';
const gaps = (stays: ReturnType<typeof stay>[], from = start, to = end) =>
    getStayTimeline(stays, from, to).filter(item => !('stay' in item));

test('finds gaps in chronological order within the trip dates', () => {
    expect(gaps([stay(2, '2026-10-06', '2026-10-08'), stay(1, '2026-10-02', '2026-10-04')])).toEqual([
        { from: start, to: '2026-10-02' },
        { from: '2026-10-04', to: '2026-10-06' },
        { from: '2026-10-08', to: end },
    ]);
});

test('omits gaps for touching and overlapping stays and dates outside the trip', () => {
    expect(gaps([
        stay(1, '2026-09-30', '2026-10-05'),
        stay(2, '2026-10-02', '2026-10-03'),
        stay(3, '2026-10-05', '2026-10-11'),
    ])).toEqual([]);
    expect(gaps([])).toEqual([{ from: start, to: end }]);
    expect(gaps([], start, start)).toEqual([]);
    expect(gaps([stay(1, '2026-10-03', '2026-10-04')], '2026-10-01T23:00:00', '2026-10-05T01:00:00')).toEqual([
        { from: start, to: '2026-10-03' },
        { from: '2026-10-04', to: '2026-10-05' },
    ]);
});

test('opens a gap with prefilled dates, creates a stay, and refreshes the section', async ({ page, api }) => {
    api.useScenario(scenarios.trip);
    const currentTrip = {
        ...trip, timestampStart: start, timestampEnd: end,
        stays: [stay(1, '2026-10-02', '2026-10-04'), stay(2, '2026-10-06', '2026-10-08')],
    };
    await page.route(`**/test-api/trip/${trip.id}`, route => route.fulfill({ json: currentTrip }));
    await page.route('**/test-api/stay', route => {
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject({ from: '2026-10-04', to: '2026-10-06', cityId: city.id });
        currentTrip.stays.push(stay(3, '2026-10-04', '2026-10-06'));
        return route.fulfill({ status: 204 });
    });
    await page.goto(`/trips/${trip.id}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: /^Add stay from/ })).toHaveCount(3);
    await page.getByRole('button', { name: 'Add stay from 2026-10-04 to 2026-10-06' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByText('Add Stay', { exact: true })).toBeVisible();
    await expect(dialog.getByRole('textbox').nth(0)).toHaveValue('2026-10-04');
    await expect(dialog.getByRole('textbox').nth(1)).toHaveValue('2026-10-06');
    await dialog.getByRole('combobox').nth(1).fill(city.name!);
    await dialog.getByRole('option', { name: `${city.name}, ${city.country!.name}`, exact: true }).click();
    await dialog.getByRole('button', { name: 'Save Stay', exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('button', { name: /^Add stay from/ })).toHaveCount(2);
    await expect(page.locator('.stay-item')).toHaveCount(3);
    await page.locator('.stay-item').first().click();
    await expect(page.getByRole('dialog').getByText('Edit Stay', { exact: true })).toBeVisible();
});
