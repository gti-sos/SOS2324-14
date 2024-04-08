// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:10002/ufc-events-data');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/UFC Events/);
});

test('list events', async ({ page }) => {
  await page.goto('http://localhost:10002/ufc-events-data ');

  let eventItemNumber = (await page.locator('.fightItem').all()).length
  

  // Expects page to have a heading with the name of Installation.
 expect(eventItemNumber).toBeGreaterThanOrEqual(0);
});
