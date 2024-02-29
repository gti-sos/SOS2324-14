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
            res.status(201).send("Se han creado 10 datos o más en el array de NodeJS.");
        } else {
            res.status(409).send("El array de NodeJS ya contiene datos. No se han creado nuevos datos.");
        }
    });

    //GET Un recurso inexistente
    app.get(API_BASE + "/datos-youtube", (req, res) => {
        res.status(404).json({ error: "No se encuentra el recurso especificado" });
    });

    // GET para obtener los datos relacionados con el país "Albania"
    app.get(API_BASE + "/youtube-trends/Albania", (req, res) => {
        const datosAlbania = data_VEG.filter(item => item.country === "Albania");
    
        // Verificar si se encontraron datos para el país "Albania"
        if (datosAlbania.length === 0) {
            res.status(404).json({ error: "No se encontraron datos para el país Albania" });
        } else {
            res.status(200).json(datosAlbania);
        }
    });

    //POST para crear un nuevo dato
    app.post(API_BASE + "/youtube-trends", (req, res) => {
        const nuevoDato = req.body;
        
        // Verificar si el campo 'id' está presente en el objeto recibido
        if (!nuevoDato.hasOwnProperty('id')) {
            res.status(400).json({ error: "Falta el campo 'id' en el nuevo dato." });
            return;
        }
        
        // Verificar si el ID ya existe en la base de datos
        const idExistente = data_VEG.some(item => item.id === nuevoDato.id);
        if (idExistente) {
            res.status(409).json({ error: "Conflicto. El ID ya existe en la base de datos." });
        } else {
            data_VEG.push(nuevoDato);
            res.status(201).json({ success: "Nuevo dato creado exitosamente." });
        }
    });

    // POST No permitido en un recurso
    app.post(API_BASE + "/youtube-trends/channel_title", (req, res) => {
        res.status(405).json({ error: "Método no permitido" });
    });



    //PUT para actualizar un dato existente
    app.put(API_BASE + "/youtube-trends/:id", (req, res) => {
        const id = req.params.id;
        const nuevoDato = req.body;
        const index = data_VEG.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            // Actualizar solo las propiedades proporcionadas en el cuerpo de la solicitud
            Object.assign(data_VEG[index], nuevoDato);
            res.status(200).json({ success: "Dato actualizado exitosamente." });
        } else {
            res.status(404).json({ error: "No se encontró el dato para actualizar." });
        }
    });

    //PUT No permitido en un recurso
    app.put(API_BASE + "/youtube-trends", (req, res) => {
        res.status(405).json({ error: "Método no permitido" });
    });

    //DELETE para eliminar un dato existente
    app.delete(API_BASE + "/youtube-trends/:id", (req, res) => {
        const id = req.params.id.toString(); // Convertir el ID de la solicitud a cadena
        const index = data_VEG.findIndex(item => item.id.toString() === id); // Convertir el ID del objeto a cadena para comparar
        if (index !== -1) {
            data_VEG.splice(index, 1);
            res.status(200).json({ success: "Dato eliminado exitosamente." });
        } else {
            res.status(404).json({ error: "No se encontró el dato para eliminar." });
        }
    });


}

module.exports = api_VEG;