//let cool = require("cool-ascii-faces");
import express from "express";
import bodyParser from "body-parser";
import dataStore from "nedb";
import {handler} from "./front/build/handler.js";
import cors from "cors";

//APIs
import {api_EGO} from './backEGO/indexAPI-EGOv1.js';
import {api_VEG} from './backVEG/api-VEG-v1.js';
import {api_NRM} from './BackNRM/index-api-v2.js';

let dbMovies = new dataStore();
let db = new dataStore();
let dbUfc = new dataStore();

let app = express();

const PORT = (process.env.PORT || 10002);

app.use(cors({
    "origin": "*",
    "methods" : "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus":204
}));

app.use(bodyParser.json());

//app.use("/",express.static("./public"));

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}.`);
});

// Nicolas Redondo Moreno
// API v1
api_NRM(app, dbUfc);

// Enrique Garcia Olivares
// API v1
api_EGO(app, dbMovies);

// Víctor Escalera García
// API v1
api_VEG(app, db);

app.use(handler);