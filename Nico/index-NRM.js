const fs = require('fs');

const data = fs.readFileSync('ufc_dataset.csv', 'utf8');

function contarCiudades(dataset) {
    
    const lineas = dataset.split('\n');
    
    const ciudadesUnicas = new Set();
    
    lineas.slice(1).forEach((linea) => {
        const ciudad = linea.split(';')[0].trim();
        ciudadesUnicas.add(ciudad);
    });
    
    // Retornar el tamaño del conjunto, que representa el número de ciudades únicas
    return ciudadesUnicas.size;
}

const numeroCiudades = contarCiudades(data);
console.log('En el dataset hay', numeroCiudades, ' ciudades distintas.');