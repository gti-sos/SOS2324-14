const fs = require('fs');

const filePath = 'youtube_dataset.csv';
const fileData = fs.readFileSync(filePath, 'utf-8');

// Dividir el contenido del archivo en filas
const filas = fileData.trim().split('\n');

const datos = [];

filas.forEach(row => {
    // Dividir la fila en columnas
    const columna = row.split(',');

    // Crear un objeto con las columnas
    const rowData = {
        country: columna[0],
        title: columna[1],
        publishedAt: columna[2],
        channelTitle: columna[3],
        categoryId: parseInt(columna[4]),
        trending_date: columna[5],
        view_count: parseInt(columna[6]),
        comment_count: parseInt(columna[7])
    };

    // Agregar el objeto al array de datos
    datos.push(rowData);
});

// Función para calcular la media de view_count para un país específico
function calcularMediaViewCount(pais) {
    const filasPais = datos.filter(item => item.country === pais);
    const valoresViewCount = filasPais.map(item => item.view_count);
    const sumaViewCount = valoresViewCount.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
    const mediaViewCount = sumaViewCount / filasPais.length;
    return mediaViewCount;
}

// País para el que se desea calcular la media
const paisBuscado = 'Spain';

// Calcular la media de view_count para el país deseado
const mediaViewCountPaisBuscado = calcularMediaViewCount(paisBuscado);

console.log(`La media de view_count para ${paisBuscado} es: ${mediaViewCountPaisBuscado}`);

