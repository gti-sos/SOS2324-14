const fs = require('fs');
const Papa = require('papaparse');

// Lee el archivo CSV
let csvData = fs.readFileSync('movie_dataset.csv', 'utf8');

// Inicializa un array para almacenar los datos
let movies = [];

// Parsea el CSV
Papa.parse(csvData, {
  header: true,
  dynamicTyping: true,
  complete: (result) => {
    // Obtiene los datos parseados
    const data = result.data;

    // Almacena los datos en el array
    movies.push(...data);

    // Muestra los 3 primeros datos del array
    console.log(movies.slice(0,3));
  }
});

module.exports = movies.slice(0,11)

function presupuestoMedio(movies) {
  // Creo el array presupuestos donde estarán el budget de cada pelicula 
  let presupuestos = new Array();
  for (let i = 0; i < movies.length; i++){
    presupuestos.push(parseInt(movies[i].budget))
  }
  // Calculamos la suma de los presupuestos con reduce
  let sumaPresupuestos = presupuestos.reduce((a,b) => a + b, 0)
  // Obtenemos el total de peliculas para hacer la media
  let totalPeliculas = presupuestos.length
  
  return sumaPresupuestos/totalPeliculas
}

let averageBudget = presupuestoMedio(movies);

console.log(`El presupuesto medio es ${Math.round(averageBudget)}€`);
 
//module.exports = movies;