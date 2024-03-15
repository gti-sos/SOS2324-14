//let cool = require("cool-ascii-faces");
let express = require("express");
let bodyParser = require("body-parser");
let dataStore = require("nedb");

let data_VEG = require('./Victor/index-VEG');
let calcularMediaTiempoPelea = require('./Nico/index-NRM');

//APIs
let enriqueAPI = require("./Enrique/indexAPI-EGO");
let api_VEG = require('./Victor/api-VEG');
let api_NRM = require('./Nico/index-api');
const data = require("./Victor/index-VEG");

let dbMovies = new dataStore();
let db = new dataStore();
let dbUfc = new dataStore();


let app = express();
const PORT = (process.env.PORT || 10002);

app.use(bodyParser.json());

app.use("/",express.static("./public"));

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}.`);
});

// Nicolas Redondo Moreno
// app.get("/samples/NRM", (req, res) => {
//     const {mediaMinu, mediaSeg}  = calcularMediaTiempoPelea();
//     console.log("mediaMinu:", mediaMinu);
//     console.log("mediaSeg:", mediaSeg);
//     const htmlResponse = `
//         <html>
//                <body>
//                 <h1>Resultado de los datos de Nico</h1>
//                 <h3>La media de tiempo de las peleas del dataset es de ${mediaMinu} minutos y ${mediaSeg} segundos.</h3>
//             </body>
//         </html>`;
//     res.send(htmlResponse);
// });

api_NRM(app, dbUfc);

//Enrique Garcia Olivares
enriqueAPI(app, dbMovies);

//Víctor Escalera García

//Ruta /samples/VEG eliminada
//app.get("/samples/VEG", (req, res) => {
//    const paisDeseado = 'Albania'; // Puedes cambiar el país si lo deseas
//    const mediaViewCountPaisDeseado = calcularMediaViewCount(data_VEG, paisDeseado);
//    res.send(`<html><body><h1>La media de view_count para ${paisDeseado} es: ${mediaViewCountPaisDeseado}</h1></body></html>`);
//});

api_VEG(app, db);


