let cool = require("cool-ascii-faces");
let express = require("express");

let movies = require('./Enrique/index-EGO.js')

let data_VEG = require('./index-VEG');
let calcularMediaTiempoPelea = require("./Nico/index-NRM");


let app = express();
const PORT = (process.env.PORT || 10000);

app.use("/",express.static("./public"));

app.get("/cool", (req,res)=>{
    res.send(`<html><body><h1>${cool()}</h1></body></html>`);
});

app.get("/samples/EGO", (req, res) => {
    res.send("<html><body><h1>Resultado de los datos de Enrique</h1></body></html>")
    res.send(`<script src="/Enrique/index-EGO.js" type=module></script>`)
})

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
})
app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}.`);
});

//Enrique Garcia Olivares
function presupuestoMedio(movies) {
    let presupuestos = new Array();
    for (let i = 0; i < movies.length; i++){
      presupuestos.push(parseInt(movies[i].budget))
    }
    let sumaPresupuestos = presupuestos.reduce((a,b) => a + b, 0)
    let totalPeliculas = presupuestos.length
    
    return sumaPresupuestos/totalPeliculas
}

app.get("/samples/EGO", (req, res) => {
    res.send(`<html><body><h1>${presupuestoMedio(movies)}</h1></body></html>`)
})

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