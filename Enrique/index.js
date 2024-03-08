const movies_data = require("./index-EGO.js");

const API_BASE = "/api/v1";

module.exports = (app, dbMovies) => {
    
    let dataset = new Array();

    app.get(API_BASE+"/movies-dataset/loadInitialData", (req, res) => {
        dbMovies.find({}, (err, docs) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {   
                if (docs.length === 0) {
                    // Si la base de datos esta vacía añade los 10 primeros datos
                    dbMovies.insert(movies_data);
                    res.sendStatus(201, "Created");
                } else {
                    // Si la base de datos no esta vacía muestra el error 409
                    res.sendStatus(409, "Conflict");
                }
            }
        })
    });

    // GET Base
    app.get(API_BASE+"/movies-dataset", (req, res) => {
        dbMovies.find({}, (err, movies) => {
            if(err){
                res.sendStatus(500, "Internal Error");    
            } else {
                // Si hay una query para paginar, pagina el recurso
                if (req.query) {
                    let limit = req.query.limit;
                    let offset = req.query.offset;
                    res.send(JSON.stringify(movies.slice(offset, limit)));
                } else {
                    // Si no, muestra el recurso entero
                    res.send(JSON.stringify(movies.map((c) => {
                        delete c._id;
                        return c;
                    })));
                }
            }
        });
    });

    // POST Nueva pelicula
    app.post(API_BASE+"/movies-dataset", (req, res) => {
        let movie = req.body;
        // Lista de boleanos para comprobar
        let comprueba = [];
        // Listas para almacenar los datos para comprobaciones
        let primerElemento = [];
        let camposOriginal = [];
        
        dbMovies.find({}, (err, doc) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } 
            if (doc.length !== 0){
                // Si la base de datos no esta vacia:
                // Accedo al primer elemento de la bd
                primerElemento = doc[0];
                // Añado los campos originales de la bd
                camposOriginal = Object.keys(primerElemento);
                // Comprobar si la pelicula es un Array o un JSON
                if (movie instanceof Array) {
                    // Por ahora solo contemplo que los POST se hagan con un JSON, si en el body hay un Array, sera un POST no válido
                    res.status(415).send("Unsupported Media Type. Arrays are not currently supported by the API.");
                } else {
                    for(let i=0; i<Object.keys(movie).length;i++) {
                        // Para cada campo dentro de cada nueva pelicula añadida en el post, comprueba si todos los campos son correctos
                        comprueba.push(camposOriginal.includes(Object.keys(movie)[i]));
                    }
                    // Comprueba si el resultado de hacer una operacion AND a toda la lista es true o false
                    if (comprueba.reduce((a,b) => a && b)) {
                        // Comprobamos que en la base de datos no haya una pelicula con el mismo nombre que el post
                        if (doc.find(pelis => pelis.original_title === movie.original_title)) {
                            // 16.2 POST A recurso existente
                            res.sendStatus(409, "Conflict");
                        } else {
                            // Si todos los campos son correctos y no hay otra pelicula igual, hacemos el POST
                            dbMovies.insert(movie);
                            res.sendStatus(201, "Created");
                        }
                    } else {
                        // 16.3 BAD REQUEST POST, los campos del objeto en el POST no son correctos
                        res.sendStatus(400, "Bad Request");
                    }
                } 
            } else {
                // Si la base de datos está vacía, se puede hacer el post correctamente
                dbMovies.insert(movie);
                res.sendStatus(201, "Created");
            }    
        })
    });

    // DELETE Del recurso
    app.delete(API_BASE+"/movies-dataset", (req, res) => {
        dbMovies.find({}, (err, docs) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {  
                if (docs.length === 0) {
                    // Si la base de datos ya esta vacía, devuelve un codigo 409
                    res.sendStatus(409, "Conflict");
                } else {
                    dbMovies.remove({}, { multi: true }, (err, numRemoved) => {
                        if (err) {
                            res.sendStatus(500, "Internal Error");
                        } else {
                            res.status(200).send(`OK, ${numRemoved} data deleted`);
                        }
                    })
                }
            }
        })
    });

    // 16.4 GET Un recurso inexistente
    app.get(API_BASE+"/datos-peliculas", (req, res) => {
        res.sendStatus(404, "Not Found");
    });

    // 16.5 PUT No permitido
    app.put(API_BASE+"/movies-dataset", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });

    // GET Del recurso Avatar
    app.get(API_BASE+"/movies-dataset/:title", (req, res) => {
        let title = req.params.title;
        // Como tenemos identififcadores con espacios, primero limpiamos el parametro para que sea igual que el de la BD
        if (title.includes("%20")) {
            title = encodeURIComponent(nombre);
        }
        // Ahora buscamos las peliculas cuyo titulo original coincide con el recurso buscado
        dbMovies.find({ original_title: title }, (err, doc) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (doc.length === 0) {
                    res.sendStatus(404, "Not Found");
                } else {
                    res.send(JSON.stringify(doc[0]));
                }
            }
        })
    });

    // POST No permitido en un recurso
    app.post(API_BASE+"/movies-dataset/:title", (req, res) => {
        res.sendStatus(405, "Method Not Allowed");
    });

    //16.1 PUT Con el mismo id
    app.put(API_BASE+"/movies-dataset/:title", (req,res) => {
        let cambio = req.body;
        let title = req.params.title;
        dbMovies.find({ original_title: title} , (err, doc) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                let objeto = doc[0];
                if (doc.length === 0) {
                    res.sendStatus(404, "Not Found");
                } else {
                    if (cambio.original_title === objeto.original_title) {
                        // Utilizo inser con upsert = true para que el objeto ya existente se actualice, es decir se haga el PUT
                        dbMovies.update({ original_title: title}, cambio, { upsert: true }); 
                        res.sendStatus(201, "Created");
                    } else {
                        res.sendStatus(400, "Bad Request");
                    }
                }
            }
        });
    });

    // DELETE El recurso Avatar
    app.delete(API_BASE+"/movies-dataset/:title", (req, res) => {
        let title = req.params.title;

        if (title.includes("%20")) {
            title = encodeURIComponent(nombre);
        }

        dbMovies.remove({"original_title": title}, {}, (err, numRemoved) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                if (numRemoved >= 1) {
                    res.sendStatus(200, "OK");
                } else {
                    res.sendStatus(404, "Not Found");
                }
            }
        })
    });

    // Painación de la API
    app.get(API_BASE+"/pruebas", (req, res) => {
        let limit = req.query.limit
        let offset = req.query.offset
        dbMovies.find({}, (err, doc) => {
            if (err) {
                res.sendStatus(500, "Internal Error");
            } else {
                //let primero = doc[limit]
 //               res.send(JSON.stringify(doc.slice(offset, limit)));
            }
        });
    });
}