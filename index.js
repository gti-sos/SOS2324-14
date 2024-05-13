import express from "express";
import bodyParser from "body-parser";
import dataStore from "nedb";
import {handler} from "./front/build/handler.js";
import cors from "cors";

//APIs
import {api_EGO} from './backEGO/indexAPI-EGOv1.js';
import {api_EGO_v2} from './backEGO/indexAPI-EGOv2.js';
import {api_VEG} from './backVEG/api-VEG-v1.js';
import {api_VEG_v2} from './backVEG/api-VEG-v2.js';
import {api_NRM} from './BackNRM/index-api-v2.js';

//para el proxy
import request from "request";

let dbMovies = new dataStore();
let db = new dataStore();
let dbUfc = new dataStore();

let app = express();

const PORT = (process.env.PORT || 10002);

app.use(cors());


//Proxy NRM
app.use("/proxyNRM", function(req,res){
    var url = "https://sos2324-14.appspot.com/api/v2/ufc-events-data";
    console.log("piped: " + req.url);
    req.pipe(request(url)).pipe(res);
});

app.use(bodyParser.json());

//app.use("/",express.static("./public"));

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}.`);
});



//Middleware para el proxy de la API VEG (para hacer pruebas)
app.use("/proxyVEG", function(req, res) {
    var url = "https://sos2324-14.appspot.com/api/v1/youtube-trends" + req.url;
    console.log("Proxying to: " + url);
    req.pipe(request(url)).pipe(res);
});

// Nicolas Redondo Moreno
// API v1
api_NRM(app, dbUfc);

// Enrique Garcia Olivares
// API v1
api_EGO(app, dbMovies);
api_EGO_v2(app, dbMovies);

// Víctor Escalera García
// API v1
api_VEG(app, db);
api_VEG_v2(app, db);

app.use(handler);