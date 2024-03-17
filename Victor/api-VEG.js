const data_VEG = require('./index-VEG');
const API_BASE = "/api/v1";

//const dataStore = require('nedb');
//const db = new dataStore({ filename: 'data.db', autoload: true });

module.exports = (app, db) => {

    //let dataset = new Array();


    //Documentación Postman
    app.get(API_BASE + "/youtube-trends/docs", (req, res) => {
        res.status(301).redirect("https://documenter.getpostman.com/view/33038536/2sA2xnxpcY")
    });

    //GET Punto 13: Introducir datos
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

    // GET para obtener datos con paginación
    app.get(API_BASE + "/youtube-trends", (req, res) => {
        const queryParams = req.query;
        const limit = parseInt(queryParams.limit) || 10;
        const offset = parseInt(queryParams.offset) || 0;

        let query = {};

        Object.keys(queryParams).forEach(key => {
            if (key !== 'limit' && key !== 'offset') {
                const value = !isNaN(queryParams[key]) ? parseFloat(queryParams[key]) : queryParams[key];
                if (typeof value === 'string') {
                    query[key] = new RegExp(value, 'i');
                } else {
                    query[key] = value;
                }
            }
        });

        if ('id' in queryParams) {
            return res.sendStatus(400, "Bad Request");
        }

        db.find(query).sort({ id: 1 }).skip(offset).limit(limit).exec((err, data_VEG) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                const datosFinal = data_VEG.map(d => {
                    const { _id, ...datosSin_id } = d;
                    return datosSin_id;
                });
                res.status(200).json(datosFinal);
            }
        });
    });

    // GET para obtener un recurso por su ID
    app.get(API_BASE + "/youtube-trends/:id", (req, res) => {
        const resourceId = parseInt(req.params.id); // Obtener el ID del recurso de los parámetros de la ruta

        // Buscar el recurso por su ID en la base de datos
        db.findOne({ id: resourceId }, (err, resource) => {
            if (err) {
                console.error(err);
                res.sendStatus(500); // Devolver un error 500 si hay un problema con la base de datos
            } else if (resource) {
                res.status(200).json(resource); // Devolver el recurso encontrado como un objeto JSON si existe
            } else {
                res.sendStatus(404); // Devolver un error 404 si el recurso no fue encontrado
            }
        });
    });

    //D01: GET para obtener un recurso por title, channel_title y published_at
    app.get(API_BASE + "/youtube-trends/:title/:channel_title/:published_at", (req, res) => {
        const title = req.params.title;
        const channelTitle = req.params.channel_title;
        const publishedAt = req.params.published_at;  // Cambio de req.params a req.query

        let query = {
            title: title,
            channel_title: channelTitle,
            published_at: publishedAt
        };

        db.findOne(query).exec((err, resource) => {
            if (err) {
                console.error(err);
                res.sendStatus(500, "Internal Error");
            } else if (resource) {
                res.status(200).json(resource);
            } else {
                res.sendStatus(404, "Not Found");
            }
        });
    });

    //D01: PUT para actualizar un recurso por title, channel_title y published_at
    app.put(API_BASE + "/youtube-trends/:title/:channel_title/:published_at", (req, res) => {
        const title = req.params.title;
        const channelTitle = req.params.channel_title;
        const publishedAt = req.query.published_at;

        let query = {
            title: title,
            channel_title: channelTitle
        };

        // Verificar si se proporciona el published_at
        if (publishedAt) {
            const year = new Date(publishedAt).getFullYear();
            query.published_at = year.toString();
        }

        // Actualizar el recurso en la base de datos
        db.update(query, { $set: req.body }, { multi: true }, (err, numUpdated) => {
            if (err) {
                console.error(err);
                res.sendStatus(500, "Internal Error");
            } else if (numUpdated > 0) {
                res.sendStatus(200, "OK");
            } else {
                res.sendStatus(404, "Not Found");
            }
        });
    });

    //D01: DELETE para eliminar un recurso por title, channel_title y published_at
    app.delete(API_BASE + "/youtube-trends/:title/:channel_title/:published_at", (req, res) => {
        const title = req.params.title;
        const channelTitle = req.params.channel_title;
        const publishedAt = req.query.published_at;

        let query = {
            title: title,
            channel_title: channelTitle
        };

        // Verificar si se proporciona el published_at
        if (publishedAt) {
            const year = new Date(publishedAt).getFullYear();
            query.published_at = year.toString();
        }

        // Eliminar el recurso de la base de datos
        db.remove(query, { multi: true }, (err, numRemoved) => {
            if (err) {
                console.error(err);
                res.sendStatus(500, "Internal Error");
            } else if (numRemoved > 0) {
                res.sendStatus(200, "OK");
            } else {
                res.sendStatus(404, "Not Found");
            }
        });
    });



    //POST para crear un nuevo dato
    app.post(API_BASE + "/youtube-trends", (req, res) => {
        const nuevoDato = req.body;

        // Verificar el orden de las propiedades recibidas
        const expectedOrder = ['id', 'country', 'title', 'published_at', 'channel_title', 'category_id', 'trending_date', 'view_count', 'comment_count'];
        const receivedFields = Object.keys(nuevoDato);

        // Verificar si el orden de las propiedades coincide con el esperado
        const isValidOrder = expectedOrder.every((field, index) => receivedFields[index] === field);

        if (!isValidOrder) {
            // Si el orden no es válido, devolver código de estado 400 (Bad Request)
            res.status(400).send("Bad Request: El orden de las propiedades es incorrecto.");
            return;
        }

        // Verificar si el objeto recibido tiene la estructura de campos esperada
        const expectedFields = ['id', 'country', 'title', 'published_at', 'channel_title', 'category_id', 'trending_date', 'view_count', 'comment_count'];

        // Verificar si todos los campos esperados están presentes
        const isValidStructure = expectedFields.every(field => receivedFields.includes(field));

        if (!isValidStructure) {
            // Si la estructura no es válida, devolver código de estado 400 (Bad Request)
            res.sendStatus(400, "Bad Request");
            return;
        }

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
                return res.sendStatus(500, "Internal Error");
            }
            if (!existingData) {
                return res.sendStatus(404, "Not Found");
            }

            db.update({ id: idFromUrl }, { $set: newDato }, {}, (updateErr, numReplaced) => {
                if (updateErr) {
                    return res.sendStatus(500, "Internal Error");
                }
                if (numReplaced === 0) {
                    return res.sendStatus(404, "Not Found");
                }

                res.sendStatus(200, "OK");
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
                return res.sendStatus(500, "Internal Error");
            }
            if (numRemoved === 0) {
                return res.sendStatus(404, "Not Found");
            }
            res.sendStatus(200, "OK");
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