// @ts-check
const { test, expect } = require('@playwright/test');

//---------------Verifica si la página tiene un título esperado---------------
test('tiene título', async ({ page }) => {
  await page.goto('http:/localhost:10002');

  // Espera que el título "contenga" una subcadena.
  await expect(page).toHaveTitle(/APIs Grupo 14/);
});

//---------------Verifica la funcionalidad de carga de datos iniciales---------------
test('cargar datos iniciales', async ({ page }) => {
  await page.goto('http:/localhost:10002/youtube-trends');

  // Haz clic en el botón "Cargar Datos Iniciales"
  await page.click('button:text("Cargar Datos Iniciales")');

  // Espera a que aparezca el mensaje de éxito después de cargar los datos iniciales
  await page.waitForSelector('.alert', { timeout: 5000 }); // Espera a que aparezca cualquier elemento con la clase .alert
  const successMsg = await page.textContent('.alert');

  // Verifica si el mensaje de éxito contiene el texto esperado
  expect(successMsg).toContain('Datos iniciales cargados exitosamente');
});

//---------------Verifica la funcionalidad de búsqueda---------------
test('funcionalidad de búsqueda', async ({ page }) => {
  await page.goto('http:/localhost:10002/youtube-trends');

  // Ingresa un término de búsqueda y espera que la lista se actualice
  await page.fill('input[type="text"]', 'Prueba');
  await page.click('button');

  // Espera que al menos haya un elemento en la lista de videos después de la búsqueda
  await page.waitForSelector('.videoItem');
  const videos = await page.$$('.videoItem');
  expect(videos.length).toBeGreaterThanOrEqual(1);
});

//---------------Verifica la funcionalidad de paginación---------------
test('funcionalidad de paginación', async ({ page }) => {
  await page.goto('http:/localhost:10002/youtube-trends');

  // Espera que los botones de paginación estén presentes
  await page.waitForSelector('button');

  // Haz clic en el botón "Página Siguiente"
  await Promise.all([
    page.click('button:text("Página Siguiente")'),
    page.waitForSelector('.videoItem', { timeout: 30000 }), // Espera a que la lista de videos se actualice con la página siguiente
  ]);

  // Haz clic en el botón "Página Anterior"
  await page.click('button:text("Página Anterior")');

  // Espera a que la lista de videos se actualice con la página anterior
  await page.waitForSelector('.videoItem', { timeout: 30000 });
});

//---------------Verifica la funcionalidad del botón "Borrar todo"---------------
test('funcionalidad "Borrar todo"', async ({ page }) => {
  await page.goto('http:/localhost:10002/youtube-trends');

  // Haz clic en el botón "Borrar todo"
  await page.click('button:text("Borrar todo")');

  // Espera a que se procese la eliminación de todos los datos
  await page.waitForTimeout(2000);

  // Verifica que la lista de videos esté vacía después de borrar todo
  const videos = await page.$$('.videoItem');
  expect(videos.length).toBe(0);
});





