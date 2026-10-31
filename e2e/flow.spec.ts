import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function answerSetup(page: Page, cuisine = 'Indian') {
  await page.goto('./');
  await page.getByRole('button', { name: cuisine, exact: true }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('radio', { name: 'Hungry', exact: true }).click();
  await page.getByRole('radio', { name: /^\$\$\$/ }).click();
  await page.getByRole('radio', { name: /Fresh territory/ }).click();
  await expect(page.getByText('Dish 1 of 5.')).toBeVisible();
}

async function sayNo(page: Page, reason: string | RegExp) {
  await page.getByRole('button', { name: 'Not this' }).click();
  await page.getByRole('button', { name: reason }).click();
}

async function dishName(page: Page) {
  return page.getByRole('heading', { level: 1 }).innerText();
}

test('happy path ends with two correct links', async ({ page }) => {
  await answerSetup(page);
  const name = await dishName(page);
  await page.getByRole('button', { name: "Yes, that's the one" }).click();
  await expect(page.getByRole('heading', { name })).toBeVisible();

  const nearby = page.getByRole('link', { name: 'Find it nearby' });
  const recipe = page.getByRole('link', { name: 'Find a recipe' });
  await expect(nearby).toHaveAttribute(
    'href',
    /^https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=[^ ]+%20restaurant$/,
  );
  await expect(recipe).toHaveAttribute(
    'href',
    /^https:\/\/www\.google\.com\/search\?q=[^ ]+%20recipe$/,
  );
  for (const link of [nearby, recipe]) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
});

test('a reason changes the next dish', async ({ page }) => {
  await answerSetup(page);
  const first = await dishName(page);
  await sayNo(page, 'Just not feeling it');
  await expect(page.getByText('Dish 2 of 5.')).toBeVisible();
  expect(await dishName(page)).not.toBe(first);
});

test('five nos reach the final pick, and back returns to the fifth dish', async ({ page }) => {
  await answerSetup(page);
  for (let count = 0; count < 5; count += 1) {
    await sayNo(page, 'Just not feeling it');
  }
  await expect(page.getByText("Okay, I'll stop making you work for it.")).toBeVisible();
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByText('Dish 5 of 5.')).toBeVisible();
  await sayNo(page, 'Just not feeling it');

  await page.locator('.pick').first().click();
  await expect(page.getByRole('link', { name: 'Find it nearby' })).toBeVisible();
});

test('back and start over never trap the user', async ({ page }) => {
  await answerSetup(page);
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('heading', { name: 'How adventurous?' })).toBeVisible();
  await page.getByRole('button', { name: 'Start over' }).click();
  await expect(page.getByRole('heading', { name: 'What are you tired of?' })).toBeVisible();
});

test('escape closes the reason sheet without losing the dish', async ({ page }) => {
  await answerSetup(page);
  const name = await dishName(page);
  await page.getByRole('button', { name: 'Not this' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  expect(await dishName(page)).toBe(name);
  await page.getByRole('button', { name: 'Not this' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('reload keeps settings and clear my data removes them', async ({ page }) => {
  await answerSetup(page, 'Thai');
  await page.reload();
  const thai = page.getByRole('button', { name: 'Thai', exact: true });
  await expect(thai).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Clear my data' }).click();
  await expect(thai).toHaveAttribute('aria-pressed', 'false');
  await page.reload();
  await expect(thai).toHaveAttribute('aria-pressed', 'false');
});

test('focus moves to the new dish after a reason', async ({ page }) => {
  await answerSetup(page);
  await sayNo(page, 'Just not feeling it');
  await expect(page.getByText('Dish 2 of 5.')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('back from yes forgets the dish', async ({ page }) => {
  await answerSetup(page);
  await page.getByRole('button', { name: "Yes, that's the one" }).click();
  await expect(page.getByRole('link', { name: 'Find it nearby' })).toBeVisible();
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByText('Dish 1 of 5.')).toBeVisible();
  const raw = await page.evaluate(() => localStorage.getItem('fork-in-the-road'));
  expect(JSON.parse(raw ?? '{}').accepted).toEqual([]);
});

test('a double tap answers only one question', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Thai', exact: true }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('radio', { name: 'Hungry', exact: true }).dblclick();
  await expect(page.getByRole('heading', { name: 'Budget?' })).toBeVisible();
});

test('actions stay on screen at 320 by 568', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('./');
  await page.getByRole('button', { name: 'Thai', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Next' })).toBeInViewport();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('radio', { name: 'Hungry', exact: true }).click();
  await page.getByRole('radio', { name: /^\$\$\$/ }).click();
  await page.getByRole('radio', { name: /Fresh territory/ }).click();
  await expect(page.getByRole('button', { name: 'Not this' })).toBeInViewport();
});

test('survives corrupt saved data', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.setItem('fork-in-the-road', '{broken'));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'What are you tired of?' })).toBeVisible();
});

test('the whole flow works from the keyboard', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Thai', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'Next' }).focus();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('heading', { name: 'How hungry?' })).toBeVisible();
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: 'Snacky' })).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('heading', { name: 'Budget?' })).toBeVisible();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'How adventurous?' })).toBeVisible();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByText('Dish 1 of 5.')).toBeVisible();
});

test('every screen passes automated accessibility checks', async ({ page }) => {
  const check = async () => {
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations).toEqual([]);
  };

  // Mid-animation opacity would skew contrast readings, and this covers reduced motion too.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await check();
  await page.getByRole('button', { name: 'Indian', exact: true }).click();
  await check();
  await page.getByRole('button', { name: 'Next' }).click();
  await check();
  await page.getByRole('radio', { name: 'Hungry', exact: true }).click();
  await page.getByRole('radio', { name: /^\$\$\$/ }).click();
  await page.getByRole('radio', { name: /Fresh territory/ }).click();
  await page.waitForTimeout(300);
  await check();
  await page.getByRole('button', { name: 'Not this' }).click();
  await page.waitForTimeout(300);
  await check();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: "Yes, that's the one" }).click();
  await page.waitForTimeout(300);
  await check();
});

test('capture screenshots', async ({ page }) => {
  for (const [label, size] of [
    ['phone', { width: 390, height: 844 }],
    ['desktop', { width: 1280, height: 800 }],
    ['small', { width: 320, height: 568 }],
  ] as const) {
    await page.setViewportSize(size);
    const shot = (name: string) =>
      page.screenshot({ path: `test-results/shots/${label}-${name}.png`, fullPage: true });

    await page.goto('./');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByRole('button', { name: 'Indian', exact: true }).click();
    await shot('1-tired');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(300);
    await shot('2-hunger');
    await page.getByRole('radio', { name: 'Hungry', exact: true }).click();
    await page.getByRole('radio', { name: /^\$\$\$/ }).click();
    await page.getByRole('radio', { name: /Fresh territory/ }).click();
    await page.waitForTimeout(300);
    await shot('3-proposal');
    await page.getByRole('button', { name: 'Not this' }).click();
    await page.waitForTimeout(300);
    await shot('4-sheet');
    await page.getByRole('button', { name: 'Just not feeling it' }).click();
    for (let count = 0; count < 4; count += 1) {
      await sayNo(page, 'Just not feeling it');
    }
    await page.waitForTimeout(300);
    await shot('5-final');
    await page.locator('.pick').first().click();
    await page.waitForTimeout(300);
    await shot('6-yes');
  }
});
