let cool = require("cool-ascii-faces");
let express = require("express");
let bodyParser = require("body-parser");
let dataStore = require("nedb");

let data_VEG = require('./Victor/index-VEG');
let calcularMediaTiempoPelea = require('./Nico/index-NRM');
let presupuesto = require("./Enrique/index-EGO");

//APIs
let enriqueAPI = require("./Enrique/index");
let api_VEG = require('./Victor/api-VEG');
let api_NRM = require('./Nico/index-api');

let dbMovies = new dataStore();


let app = express();
const PORT = (process.env.PORT || 10002);

app.use(bodyParser.json());

app.use("/",express.static("./public"));

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}.`);
});

app.get("/cool", (req,res)=>{
    res.send(`<html><body><h1>${cool()}</h1></body></html>`);
});

// Nicolas Redondo Moreno
app.get("/samples/NRM", (req, res) => {
    const {mediaMinu, mediaSeg}  = calcularMediaTiempoPelea();
    console.log("mediaMinu:", mediaMinu);
    console.log("mediaSeg:", mediaSeg);
    const htmlResponse = `
        <html>
               <body>
                <h1>Resultado de los datos de Nico</h1>
                <h3>La media de tiempo de las peleas del dataset es de ${mediaMinu} minutos y ${mediaSeg} segundos.</h3>
            </body>
        </html>`;
    res.send(htmlResponse);
});

api_NRM(app);

//Enrique Garcia Olivares
app.get("/samples/EGO", (req, res) => {
    let paisFiltro = "United States of America"
    let presupuestoMedioPais = presupuesto(paisFiltro)
    res.send(`<html><body><h2>El presupuesto medio de las peliculas producidas en ${paisFiltro} es de ${presupuestoMedioPais}€</h2></body></html>`)
})

enriqueAPI(app, dbMovies);

//Víctor Escalera García
function calcularMediaViewCount(data, pais) {
    const filasPais = data.filter(item => item.country === pais);
    const valoresViewCount = filasPais.map(item => item.view_count);
    const sumaViewCount = valoresViewCount.reduce((acumulador, valorActual) => acumulador + valorActual, 0);
    const mediaViewCount = sumaViewCount / filasPais.length;
    return mediaViewCount;
}

app.get("/samples/VEG", (req, res) => {
    const paisDeseado = 'Albania'; // Puedes cambiar el país si lo deseas
    const mediaViewCountPaisDeseado = calcularMediaViewCount(data_VEG, paisDeseado);
    res.send(`<html><body><h1>La media de view_count para ${paisDeseado} es: ${mediaViewCountPaisDeseado}</h1></body></html>`);
});

api_VEG(app);


