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

// test('cargar datos iniciales', async ({ page }) => {
//   await page.goto('http://localhost:10002/ufc-events-data?offset=0&limit=10');

//   await page.waitForSelector('button[color="primary"]:text("Insertar")');

// // Hacer clic en el botón "Insertar datos"
// await page.click('button[color="primary"]:text("Insertar")');

// // Espera a que aparezca el mensaje de éxito después de cargar los datos iniciales
// await page.waitForSelector('.alert', { timeout: 5000 });

// // Obtener el texto del mensaje de éxito
// const successMsg = await page.textContent('.alert');
// });

