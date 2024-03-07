const data_VEG = require('./index-VEG');
const API_BASE = "/api/v1";

const dataStore = require('nedb');
const db = new dataStore({ filename: 'data.db', autoload: true });

function api_VEG(app) {

    //let dataset = new Array();

    //GET Punto 13: Crear datos si no hay
    app.get(API_BASE + "/youtube-trends/loadInitialData", (req, res) => {
        db.find({}, (err, docs) => {
            if (err) {
                console.error(err);
                res.sendStatus(500, "Internal Error");
            } else {
                if (docs.length === 0) {
                    // Insertar datos iniciales en la base de datos
                    db.insert(data_VEG, (err, newDocs) => {
                        if (err) {
                            console.error(err);
                            res.sendStatus(500, "Internal Error");
                        } else {
                            res.sendStatus(201, "Created");
                        }
                    });
                } else {
                    res.sendStatus(409, "Conflict");
                }
            }
        });
    });

    //GET inicial
    app.get(API_BASE + "/youtube-trends", (req, res) => {
        db.find({}).sort({ id: 1 }).exec((err, data) => { // Orden ascendente por ID
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                res.status(200).json(data);
            }
        });
    });

    // GET para obtener los datos relacionados con un país específico
    app.get(API_BASE + "/youtube-trends/:country", (req, res) => {
        const country = req.params.country;
        db.find({ country: country }).sort({ id: 1 }).exec((err, docs) => {
            if (err) {
                console.error(err);
                res.sendStatus(500, "Internal Error");
            } else if (docs && docs.length > 0) {
                res.status(200).json(docs);
            } else {
                res.sendStatus(404, "Not Found");
            }
        });
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
        db.findOne({ id: nuevoDato.id }, (err, existingData) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
                return;
            }

            if (existingData) {
                res.sendStatus(409, "Conflict");
            } else {
                // Insertar el nuevo dato en la base de datos
                db.insert(nuevoDato, (err, insertedData) => {
                    if (err) {
                        res.sendStatus(500, "Internal Error");
                    } else {
                        res.sendStatus(201, "Created");
                    }
                });
            }
        });
    });

    // POST No permitido en un recurso
    app.post(API_BASE + "/youtube-trends/channel_title", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });



    //PUT para actualizar un dato existente
    app.put(API_BASE + "/youtube-trends/:id", (req, res) => {
        const idFromUrl = parseInt(req.params.id); 
        const newDato = req.body;

        if (idFromUrl !== newDato.id) {
            return res.status(400).send("Bad Request: El ID en la URL y en el cuerpo de la solicitud no coinciden");
        }

        db.findOne({ id: idFromUrl }, (findErr, existingData) => {
            if (findErr) {
                return res.sendStatus(500,"Internal Error");
            }
            if (!existingData) {
                return res.sendStatus(404,"Not Found");
            }
    
            db.update({ id: idFromUrl }, { $set: newDato }, {}, (updateErr, numReplaced) => {
                if (updateErr) {
                    return res.sendStatus(500,"Internal Error");
                }
                if (numReplaced === 0) {
                    return res.sendStatus(404,"Not Found");
                }

                res.sendStatus(200,"OK");
            });
        });
    });

    //PUT No permitido en un recurso
    app.put(API_BASE + "/youtube-trends", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });



    // DELETE para eliminar un dato existente
    app.delete(API_BASE + "/youtube-trends/:id", (req, res) => {
        const id = parseInt(req.params.id);
    
        db.remove({ id: id }, {}, (err, numRemoved) => {
            if (err) {
                return res.sendStatus(500,"Internal Error");
            }
            if (numRemoved === 0) {
                return res.sendStatus(404,"Not Found");
            }
            res.sendStatus(200,"OK");
        });
    });

    // DELETE para eliminar todos los recursos
    app.delete(API_BASE + "/youtube-trends", (req, res) => {
        db.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                console.error(err);
                res.sendStatus(500, "Internal Error");
            } else {
                res.sendStatus(200, "OK");
            }
        });
    });

    //GET Un recurso inexistente
    app.get(API_BASE + "/*", (req, res) => {
        res.sendStatus(404, "Not Found");
    });


}

module.exports = api_VEG;