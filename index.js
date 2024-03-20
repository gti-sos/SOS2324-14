//let cool = require("cool-ascii-faces");
import express from "express";
import bodyParser from "body-parser";
import dataStore from "nedb";
import { handler } from "./front/build/handler.js";

//APIs
import {api_EGO} from './backEGO/indexAPI-EGOv1.js';
import {api_VEG} from './Victor/api-VEG-v1.js';
import {api_NRM} from './Nico/index-api-v1.js';
import {loadBackendEGO} from "./backEGO/indexAPI-EGOv2.js";
import {loadBackendVEG} from "./Victor/api-VEG-v2.js";
import {loadBackendNRM} from "./Nico/index-api-v2.js";

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
// API v1
api_NRM(app, dbUfc);
// API v2
loadBackendNRM(app, dbUfc);

// Enrique Garcia Olivares
// API v1
api_EGO(app, dbMovies);
// API v2
loadBackendEGO(app, dbMovies);

// Víctor Escalera García

//Ruta /samples/VEG eliminada
//app.get("/samples/VEG", (req, res) => {
//    const paisDeseado = 'Albania'; // Puedes cambiar el país si lo deseas
//    const mediaViewCountPaisDeseado = calcularMediaViewCount(data_VEG, paisDeseado);
//    res.send(`<html><body><h1>La media de view_count para ${paisDeseado} es: ${mediaViewCountPaisDeseado}</h1></body></html>`);
//});
// API v1
api_VEG(app, db);
// API v2
loadBackendVEG(app, db);

app.use(handler);