const data_VEG = require('./index-VEG');
const API_BASE = "/api/v1";

//const dataStore = require('nedb');
//const db = new dataStore({ filename: 'data.db', autoload: true });

module.exports = (app, db) => {

    //let dataset = new Array();

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
    const page = parseInt(req.query.page) || 1; // Página solicitada (predeterminada: 1)
    const limit = parseInt(req.query.limit) || 10; // Número de resultados por página (predeterminado: 10)
    const skip = (page - 1) * limit; // Salto para la paginación

    // Filtros opcionales
    const filters = {};
    if (req.query.country) filters.country = req.query.country;
    if (req.query.title) filters.title = req.query.title;
    if (req.query.publishedAt) {
        const publishedAt = req.query.publishedAt;
        const [year, month] = publishedAt.split("-"); // Dividir el valor de la URL en año y mes
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0, 23, 59, 59);
        filters.published_at = { $gte: startOfMonth.toISOString(), $lte: endOfMonth.toISOString() };
    }
    if (req.query.channelTitle) filters.channel_title = req.query.channelTitle;
    if (req.query.categoryId) filters.category_id = parseInt(req.query.categoryId);
    if (req.query.trendingDate) filters.trending_date = req.query.trendingDate;
    if (req.query.viewCount) filters.view_count = parseInt(req.query.viewCount);
    if (req.query.commentCount) filters.comment_count = parseInt(req.query.commentCount);

    // Realizar la consulta con los filtros y la paginación
    db.find(filters).sort({ id: 1 }).skip(skip).limit(limit).exec((err, docs) => {
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