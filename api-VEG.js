const express = require("express");
const data_VEG = require('./index-VEG');
const API_BASE = "/api/v1";

function api_VEG(app) {

    //GET inicial
    app.get(API_BASE + "/youtube-trends", (req, res) => {
        res.status(200).json(data_VEG);
    });

    //GET Punto 13: Crear datos si no hay
    app.get(API_BASE + "/youtube-trends/loadInitialData", (req, res) => {
        if (data_VEG.length === 0) {
            for (let i = 0; i < 10; i++) {
                const nuevoDato = {
                    id: i + 1,
                    country: 'Ejemplo',
                    title: `Título ${i + 1}`,
                    published_at: new Date().toISOString(),
                    channel_title: 'Canal Ejemplo',
                    category_id: Math.floor(Math.random() * 100),
                    trending_date: 'Ejemplo',
                    view_count: Math.floor(Math.random() * 1000000),
                    comment_count: Math.floor(Math.random() * 1000)
                };
                data_VEG.push(nuevoDato);
            }
            res.sendStatus(201, "Created");
        } else {
            res.sendStatus(409, "Conflict");
        }
    });

    //GET Un recurso inexistente
    app.get(API_BASE + "/datos-youtube", (req, res) => {
        res.sendStatus(404, "Not Found");
    });

    // GET para obtener los datos relacionados con el país "Albania"
    app.get(API_BASE + "/youtube-trends?country=Albania", (req, res) => {
        const datosAlbania = data_VEG.filter(item => item.country === "Albania");

        // Verificar si se encontraron datos para el país "Albania"
        if (datosAlbania.length === 0) {
            res.sendStatus(404, "Not Found");
        } else {
            res.status(200).json(datosAlbania);
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
        const idExistente = data_VEG.some(item => item.id === nuevoDato.id);
        if (idExistente) {
            res.sendStatus(409, "Conflict");
        } else {
            data_VEG.push(nuevoDato);
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
            const index = data_VEG.findIndex(item => item.id === parseInt(idFromUrl));
            if (index !== -1) {
                Object.assign(data_VEG[index], newDato);
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
        const index = data_VEG.findIndex(item => item.id.toString() === id);
        if (index !== -1) {
            data_VEG.splice(index, 1);
            res.sendStatus(200, "OK");
        } else {
            res.sendStatus(404, "Not Found");
        }
    });

    app.delete(API_BASE + "/youtube-trends", (req, res) => {
        // Eliminar todos los recursos
        while (data_VEG.length > 0) {
            data_VEG.pop();
        }
        res.sendStatus(200, "OK");
    });


}

module.exports = api_VEG;