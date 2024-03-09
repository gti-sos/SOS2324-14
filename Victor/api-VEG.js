const data_VEG = require('./index-VEG');
const API_BASE = "/api/v1";

//const dataStore = require('nedb');
//const db = new dataStore({ filename: 'data.db', autoload: true });

module.exports = (app, db) => {

    //let dataset = new Array();


    //Documentación Postman
    app.get(API_BASE + "/youtube-trends/docs", (req, res) => {
        res.status(301).redirect("https://documenter.getpostman.com/view/33038536/2sA2xh3Cti")
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
      
        db.find(query).skip(offset).limit(limit).exec((err, data_VEG) => {
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