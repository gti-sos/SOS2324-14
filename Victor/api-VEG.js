const data_VEG = require('./index-VEG');
const API_BASE = "/api/v1";

//const dataStore = require('nedb');
//const db = new dataStore({ filename: 'data.db', autoload: true });

module.exports = (app, db) => {

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
    app.get(API_BASE + "/youtube-trends/country/:country", (req, res) => {
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

    //GET para obtener los datos relacionados de un ID específico
    app.get(API_BASE + "/youtube-trends/id/:id", (req, res) => {
        const id = parseInt(req.params.id); // Convertir el ID a un número entero
        db.findOne({ id: id }, (err, doc) => {
            if (err) {
                console.error(err);
                res.status(500).send("Internal Error");
            } else if (doc) {
                res.status(200).json(doc);
            } else {
                res.sendStatus(404, "Not Found");
            }
        });
    });

    // GET para obtener los datos relacionados de un titulo de video específico
    app.get(API_BASE + "/youtube-trends/title/:title", (req, res) => {
        const title = req.params.title;
        db.find({ title: title }).sort({ id: 1 }).exec((err, docs) => {
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

    // GET para obtener los datos que se han publicado en una fecha (mes y año) específico
    app.get(API_BASE + "/youtube-trends/published-at/:publishedAt", (req, res) => {
        const publishedAt = req.params.publishedAt;
        const [year, month] = publishedAt.split("-"); // Dividir el valor de la URL en año y mes

        // Calcular el rango de fechas para el mes y año especificados
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59);


        db.find({ published_at: { $gte: startOfMonth.toISOString(), $lte: endOfMonth.toISOString() } }, (err, docs) => {
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

    // GET para obtener los datos relacionados de un canal específico
    app.get(API_BASE + "/youtube-trends/channel_title/:channel_title", (req, res) => {
        const channel_title = req.params.channel_title;
        db.find({ channel_title: channel_title }).sort({ id: 1 }).exec((err, docs) => {
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

    //GET para obtener los datos relacionados de un category_id específica
    app.get(API_BASE + "/youtube-trends/category_id/:category_id", (req, res) => {
        const category_id = parseInt(req.params.category_id);
        db.findOne({ category_id: category_id }, (err, doc) => {
            if (err) {
                console.error(err);
                res.sendStatus(500, "Internal Error");
            } else if (doc) {
                res.status(200).json(doc);
            } else {
                res.sendStatus(404, "Not Found");
            }
        });
    });

    // GET para obtener los datos que están en tendencia en una fecha específica
    app.get(API_BASE + "/youtube-trends/trending_date/:trendingDate", (req, res) => {
        const trendingDate = req.params.trendingDate; // Obtener el valor de la fecha de tendencia de la URL

        // Realizar la búsqueda en la base de datos utilizando el valor de la fecha de tendencia
        db.find({ trending_date: trendingDate }, (err, docs) => {
            if (err) {
                console.error(err);
                res.status(500).send("Internal Error");
            } else if (docs && docs.length > 0) {
                res.status(200).json(docs);
            } else {
                res.sendStatus(404,"Not Found");
            }
        });
    });

    //GET para obtener los datos relacionados dado un view_count
    app.get(API_BASE + "/youtube-trends/view_count/:view_count", (req, res) => {
        const view_count = parseInt(req.params.view_count); 
        db.findOne({ view_count: view_count }, (err, doc) => {
            if (err) {
                console.error(err);
                res.status(500).send("Internal Error");
            } else if (doc) {
                res.status(200).json(doc);
            } else {
                res.sendStatus(404, "Not Found");
            }
        });
    });

    //GET para obtener los datos relacionados dado un view_count
    app.get(API_BASE + "/youtube-trends/comment_count/:comment_count", (req, res) => {
        const comment_count = parseInt(req.params.comment_count); 
        db.findOne({ comment_count: comment_count }, (err, doc) => {
            if (err) {
                console.error(err);
                res.status(500).send("Internal Error");
            } else if (doc) {
                res.status(200).json(doc);
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