const express = require("express");
const data_VEG = require('./index-VEG');
const API_BASE = "/api/v1";

function api_VEG(app) {

    let dataset = new Array();

    //GET Punto 13: Crear datos si no hay
    app.get(API_BASE+"/youtube-trends/loadInitialData", (req, res) => {
        if (dataset.length === 0) {
            for(let i=0; i < data_VEG.length; i++){
                dataset.push(data_VEG[i]);
            }
            res.sendStatus(201, "Created");
        } else {
            // 16.2 POST A recurso existente
            res.sendStatus(409, "Conflict");
        }
    });

    //GET inicial
    app.get(API_BASE + "/youtube-trends", (req, res) => {
        res.status(200).json(dataset);
    });

    // GET para obtener los datos relacionados con un país específico
    app.get(API_BASE + "/youtube-trends/:country", (req, res) => {
        const country = req.params.country;
        const filteredData = dataset.filter(item => item.country === country);

        // Verificar si se encontraron datos para el país especificado
        if (filteredData && filteredData.length > 0) {
            res.send(JSON.stringify(filteredData));
            res.sendStatus(200, "OK");
        } else {
            res.sendStatus(404, "Not Found");
        }
    });

    //POST para crear un nuevo dato
    app.post(API_BASE + "/youtube-trends", (req, res) => {
        const nuevoDato = req.body;

        // Verificar si el campo 'id' está presente en el objeto recibido
        if (!nuevoDato.hasOwnProperty('id')) {
            res.sendStatus(400, "Bad Request");
            return;
        }

        // Verificar si el ID ya existe en la base de datos
        const idExistente = dataset.some(item => item.id === nuevoDato.id);
        if (idExistente) {
            res.sendStatus(409, "Conflict");
        } else {
            dataset.push(nuevoDato);
            res.sendStatus(201, "Created");
        }
    });

    // POST No permitido en un recurso
    app.post(API_BASE + "/youtube-trends/channel_title", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });



    //PUT para actualizar un dato existente
    app.put(API_BASE + "/youtube-trends/:id", (req, res) => {
        const idFromUrl = req.params.id;
        const newDato = req.body;

        // Convertir idFromUrl a cadena y que así se compare bien la id de url la id del nuevo dato
        const idFromUrlString = idFromUrl.toString();

        if (idFromUrlString !== newDato.id.toString()) {
            res.sendStatus(400, "Bad Request");
        } else {
            const index = dataset.findIndex(item => item.id === parseInt(idFromUrl));
            if (index !== -1) {
                Object.assign(dataset[index], newDato);
                res.sendStatus(200, "OK");
            } else {
                res.sendStatus(404, "Not Found");
            }
        }
    });

    //PUT No permitido en un recurso
    app.put(API_BASE + "/youtube-trends", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });


    //DELETE para eliminar un dato existente
    app.delete(API_BASE + "/youtube-trends/:id", (req, res) => {
        const id = req.params.id.toString();
        const index = dataset.findIndex(item => item.id.toString() === id);
        if (index !== -1) {
            dataset.splice(index, 1);
            res.sendStatus(200, "OK");
        } else {
            res.sendStatus(404, "Not Found");
        }
    });

    app.delete(API_BASE + "/youtube-trends", (req, res) => {
        // Eliminar todos los recursos
        while (dataset.length > 0) {
            dataset.pop();
        }
        res.sendStatus(200, "OK");
    });

    //GET Un recurso inexistente
    app.get(API_BASE + "/*", (req, res) => {
        res.sendStatus(404, "Not Found");
    });


}

module.exports = api_VEG;