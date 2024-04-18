// @ts-check
const { test, expect } = require('@playwright/test');

// Verifica si la página tiene un título esperado
test('has general title', async ({ page }) => {

  await page.goto('http://localhost:10002');


  // Espera que el título "contenga" una subcadena.
  await expect(page).toHaveTitle(/APIs Grupo 14/);
});

// Comprobar el boton de cargar datos iniciales
test('load initial movies', async ({page}) => {
  await page.goto('http://localhost:10002/movies-dataset');

  await page.getByText('Rellenar').click();

  let response = await page.textContent('.alert')
  //await window.location.reload();
  expect(response).toContain('Datos iniciales cargados con exito.');
  // let cuentaMovies =  (await page.locator('.list-group-item').all()).length;//.locator('.list-group-item').all()).length; 
  // expect(cuentaMovies).toBeGreaterThan(0);
});

test('has front title', async ({ page }) => {

  await page.goto('http://localhost:10002/movies-dataset');

  // Espera que el título "contenga" una subcadena.
  await expect(page).toHaveTitle(/Front Movies/);
});

// Comprobar que se muestra correctamente la lista de peliculas
test('list movies', async ({page}) => {

  // await page.waitForTimeout(5000)
  
  await page.goto('http://localhost:10002/movies-dataset');

  await expect(page).toHaveTitle(/Front Movies/);
  
  let cuentaMovies =  (await page.locator('.list-group-item').all()).length; 
  expect(cuentaMovies).toBeGreaterThan(0);
});

test('delete all movies', async ({page}) => {
  await page.goto('http://localhost:10002/movies-dataset');
  await page.waitForTimeout(3000)
  
  await page.getByText('Borrar Todo').click();

  let response = await page.textContent('.alert')
  expect(response).toContain('Colección borrada con exito.');
});